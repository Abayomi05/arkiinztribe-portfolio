/*
 * Verifies the acceptance criteria in
 * docs/spec-ark-local-fallback.md against the in-memory backend.
 *
 * Run with:  node --experimental-strip-types tests/ark-memory.test.ts
 */

import assert from "node:assert/strict";

import { memoryStore, __resetMemoryStore } from "../src/lib/ark-memory";

let passed = 0;

function check(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
      console.log("  PASS  " + name);
    });
}

async function run() {
  console.log("ARK local fallback\n");

  __resetMemoryStore();
  const session = "session-a";
  const other = "session-b";

  const conversation = await memoryStore.createConversation(session);

  await check("createConversation returns a local- prefixed id", () => {
    assert.equal(conversation?.id, `local-${session}`);
  });

  await check("conversation starts with an empty brief and not ready", () => {
    assert.deepEqual(conversation?.brief, {});
    assert.equal(conversation?.ready, false);
  });

  await check("getConversation succeeds for the owning session", async () => {
    const found = await memoryStore.getConversation(
      `local-${session}`,
      session,
    );
    assert.ok(found);
    assert.equal(found?.created, true);
  });

  await check(
    "getConversation returns null for a different session (AC3)",
    async () => {
      const found = await memoryStore.getConversation(
        `local-${session}`,
        other,
      );
      assert.equal(found, null);
    },
  );

  await check(
    "updateConversation rejects a mismatched session",
    async () => {
      const updated = await memoryStore.updateConversation(
        `local-${session}`,
        other,
        { project: "hijacked" },
        true,
      );
      assert.equal(updated, null);
    },
  );

  await check("addMessage stores a message", async () => {
    const message = await memoryStore.addMessage(
      `local-${session}`,
      "visitor",
      "hello",
    );
    assert.ok(message);
    assert.equal(message?.role, "visitor");
  });

  await check("addMessage ignores an unknown conversation", async () => {
    const message = await memoryStore.addMessage(
      "local-missing",
      "visitor",
      "hello",
    );
    assert.equal(message, null);
  });

  await check("getMessages returns oldest first", async () => {
    const rows = await memoryStore.getMessages(`local-${session}`);
    assert.ok(rows.length > 0);
    const times = rows.map((row) => row.created_at);
    assert.deepEqual(times, [...times].sort());
  });

  await check("updateConversation persists the brief and ready flag", async () => {
    const updated = await memoryStore.updateConversation(
      `local-${session}`,
      session,
      { project: "Logistics dashboard" },
      true,
    );
    assert.equal(updated?.ready, true);
    assert.equal(updated?.brief.project, "Logistics dashboard");
  });

  await check("first createArkLead returns created: true", async () => {
    const lead = await memoryStore.createArkLead(`local-${session}`, session, {
      email: "ada@example.com",
      project: "Logistics dashboard",
    });
    assert.equal(lead?.created, true);
  });

  await check(
    "second createArkLead returns created: false (AC4)",
    async () => {
      const lead = await memoryStore.createArkLead(
        `local-${session}`,
        session,
        { email: "ada@example.com", project: "Logistics dashboard" },
      );
      assert.equal(lead?.created, false);
    },
  );

  await check("createArkLead rejects a mismatched session", async () => {
    const lead = await memoryStore.createArkLead(`local-${session}`, other, {
      email: "eve@example.com",
      project: "Something else",
    });
    assert.equal(lead, null);
  });

  console.log("\n" + passed + " passed");
}

run().catch((error) => {
  console.error("FAILED:", error.message);
  process.exit(1);
});