import assert from "node:assert/strict";
import { loadTsModule } from "./load-ts-module.mjs";

globalThis.window ??= new EventTarget();
const { registerAccount, verifyEmail, resendOtp, loginAccount, getCurrentUser, logoutAccount, AuthApiError } = await import(await loadTsModule("src/api/auth.ts"));
const originalFetch = globalThis.fetch;
try {
  const payload = { fullName: "Test Member", email: "test@example.com", password: "Example123!", userType: "alumni", membershipType: "full", graduationYear: 2024 };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/register");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(options.body), payload);
    return Response.json({ success: true, message: "Check your email", data: { id: "test", email: payload.email } }, { status: 201 });
  };
  assert.equal((await registerAccount(payload)).data.id, "test");
  globalThis.fetch = async () => Response.json({ success: false, message: "Email already registered" }, { status: 409 });
  await assert.rejects(registerAccount(payload), /Email already registered/);
  globalThis.fetch = async () => new Response("Bad gateway", { status: 502 });
  await assert.rejects(registerAccount(payload), /Request failed \(502\)/);
  globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
  await assert.rejects(registerAccount(payload), /Could not reach the server/);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/verify-email");
    assert.deepEqual(JSON.parse(options.body), { email: payload.email, otp: "123456" });
    return Response.json({ success: true, message: "Verified" });
  };
  assert.equal((await verifyEmail({ email: payload.email, otp: "123456" })).success, true);
  const resendMessage = "If that account is awaiting verification, a new code has been sent.";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/resend-otp");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(options.body), { email: payload.email });
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ success: true, message: resendMessage });
  };
  assert.equal((await resendOtp({ email: payload.email })).message, resendMessage);
  globalThis.fetch = async () => Response.json({ success: false, message: "Please try again later." }, { status: 429 });
  await assert.rejects(resendOtp({ email: payload.email }), /Please try again later/);
  globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
  await assert.rejects(resendOtp({ email: payload.email }), /Could not reach the server/);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/login");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), { email: payload.email, password: payload.password });
    return Response.json({ success: true, message: "Login successful", data: { id: "test", email: payload.email, fullName: payload.fullName } });
  };
  assert.equal((await loginAccount({ email: payload.email, password: payload.password })).data.id, "test");
  globalThis.fetch = async () => Response.json({ success: false, message: "Please verify your email before logging in" }, { status: 403 });
  await assert.rejects(loginAccount({ email: payload.email, password: payload.password }), error => error instanceof AuthApiError && error.status === 403 && error.message === "Please verify your email before logging in");
  globalThis.fetch = async () => Response.json({ success: false, message: "Your account is awaiting admin approval" }, { status: 403 });
  await assert.rejects(loginAccount({ email: payload.email, password: payload.password }), /awaiting admin approval/);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/me");
    assert.equal(options.credentials, "include");
    return Response.json({ success: true, data: { id: "test", email: payload.email, fullName: payload.fullName } });
  };
  assert.equal((await getCurrentUser()).id, "test");
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/auth/logout");
    assert.equal(options.credentials, "include");
    return Response.json({ success: true, message: "Logged out" });
  };
  await logoutAccount();
  console.log("Auth API checks passed: registration, verification, resend, login, cookie session, logout, and error handling.");
} finally {
  globalThis.fetch = originalFetch;
}
