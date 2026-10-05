/**
 * Verifies the ARK session cookie's Secure attribute is derived from the
 * request rather than NODE_ENV.
 *
 * Previously it was NODE_ENV === "production", so any production-mode server
 * reached over plain HTTP had its cookie rejected by the browser and every
 * later ARK call 401'd.
 */
import assert from "node:assert/strict";

function isSecureRequest(
  request: { headers: Headers; nextUrl: { protocol: string } },
  env: string | undefined = process.env.ARK_SECURE_COOKIES,
) {
  const override = env?.trim().toLowerCase();

  if (override === "true") return true;
  if (override === "false") return false;

  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (forwardedProto) return forwardedProto === "https";

  return request.nextUrl.protocol === "https:";
}

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

const req = (proto: string | null, url = "http://localhost:3000") => ({
  headers: new Headers(proto ? { "x-forwarded-proto": proto } : {}),
  nextUrl: { protocol: new URL(url).protocol },
});

test("plain http gets no Secure attribute (the reported bug)", () => {
  assert.equal(isSecureRequest(req(null), undefined), false);
});

test("https URL gets Secure", () => {
  assert.equal(isSecureRequest(req(null, "https://site.vercel.app"), undefined), true);
});

test("TLS proxy: x-forwarded-proto https wins over http upstream", () => {
  assert.equal(isSecureRequest(req("https"), undefined), true);
});

test("proxy reporting http means no Secure", () => {
  assert.equal(isSecureRequest(req("http"), undefined), false);
});

test("only the first x-forwarded-proto value is used", () => {
  assert.equal(isSecureRequest(req("https, http"), undefined), true);
  assert.equal(isSecureRequest(req("http, https"), undefined), false);
});

test("ARK_SECURE_COOKIES=true forces Secure", () => {
  assert.equal(isSecureRequest(req(null), "true"), true);
});

test("ARK_SECURE_COOKIES=false disables Secure", () => {
  assert.equal(isSecureRequest(req("https"), "false"), false);
});

console.log(`\n${passed} passed\n`);