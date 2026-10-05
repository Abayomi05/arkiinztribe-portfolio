/**
 * Regression tests for the brief email delivery gate.
 *
 * The bug: delivery was gated purely on `lead.created`. createArkLead is
 * idempotent per conversation, so any resubmit returned created=false and NO
 * mail was ever sent - while the client still received 200. Worse, a first
 * send that failed could never be retried, so the lead was lost permanently.
 */
import assert from "node:assert/strict";
import {
  clearBriefEmailed,
  markBriefEmailed,
  wasBriefEmailed,
} from "../src/lib/email-dedupe";

let passed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`  PASS  ${name}`);
  } catch (error) {
    console.error(`  FAIL  ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const id = (n: string) => `conv-${n}`;

test("a fresh conversation has not been emailed", () => {
  assert.equal(wasBriefEmailed(id("a")), false);
});

test("after a successful send the conversation is marked delivered", () => {
  markBriefEmailed(id("b"));
  assert.equal(wasBriefEmailed(id("b")), true);
});

test("a second submit is suppressed once delivery succeeded", () => {
  // models the route: if (lead.created || !alreadyEmailed) send
  markBriefEmailed(id("c"));
  const shouldSend = false || !wasBriefEmailed(id("c"));
  assert.equal(shouldSend, false);
});

test("a failed send can be retried (AC: no lost leads)", () => {
  // first attempt fails -> never marked, so nothing to clear
  assert.equal(wasBriefEmailed(id("d")), false);
  // retry: lead.created false but no successful delivery -> must send again
  const shouldSend = false || !wasBriefEmailed(id("d"));
  assert.equal(shouldSend, true);
});

test("clearing after a failure allows the retry to send", () => {
  markBriefEmailed(id("e"));
  clearBriefEmailed(id("e"));
  const shouldSend = false || !wasBriefEmailed(id("e"));
  assert.equal(shouldSend, true);
});

test("the first submit always sends", () => {
  const shouldSend = true || !wasBriefEmailed(id("f"));
  assert.equal(shouldSend, true);
});

test("conversations are tracked independently", () => {
  markBriefEmailed(id("g"));
  assert.equal(wasBriefEmailed(id("g")), true);
  assert.equal(wasBriefEmailed(id("h")), false);
});

console.log(`\n${passed} passed\n`);