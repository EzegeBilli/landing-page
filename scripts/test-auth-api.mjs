// Mocked-fetch checks for src/api/auth.ts against the backend's Bearer contract
// (API_DOCUMENTATION.md, "Login response and refresh/logout details").
// No live backend is contacted.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadTsModule } from "./load-ts-module.mjs";

globalThis.window ??= new EventTarget();
const API = "http://localhost:5000/api";
const { registerAccount, verifyEmail, resendOtp, loginAccount, getCurrentUser, logoutAccount, restoreSession, AuthApiError } = await import(await loadTsModule("src/api/auth.ts"));
const { hasAccessToken } = await import(await loadTsModule("src/api/client.ts"));

const originalFetch = globalThis.fetch;
const json = (body, status = 200) => Response.json(body, { status });
const account = { id: "u1", dmin: "NMUAA-2026-00001", fullName: "Test Member", email: "test@example.com", role: "member", officeTitle: null, chapter: null };
const loginBody = (token = "jwt-login") => ({ success: true, message: "Login successful", data: { user: account, accessToken: token, expiresIn: 900, ...account } });

function mockFetch(...handlers) {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    const handler = handlers.shift();
    assert.ok(handler, `unexpected extra request to ${url}`);
    return handler(url, options);
  };
  return calls;
}

try {
  // ---- Registration flow (unauthenticated, unchanged behaviour) ----
  const payload = { fullName: "Test Member", email: "test@example.com", password: "Example123!", userType: "alumni", membershipType: "full", graduationYear: 2024 };
  let calls = mockFetch(() => json({ success: true, message: "Check your email", data: { id: "test", email: payload.email } }, 201));
  assert.equal((await registerAccount(payload)).data.id, "test");
  assert.equal(calls[0].url, `${API}/auth/register`);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].options.body), payload);
  mockFetch(() => json({ success: false, message: "Email already registered" }, 409));
  await assert.rejects(registerAccount(payload), /Email already registered/);
  mockFetch(() => new Response("Bad gateway", { status: 502 }));
  await assert.rejects(registerAccount(payload), /Request failed \(502\)/);
  mockFetch(() => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(registerAccount(payload), /Could not reach the server/);

  calls = mockFetch(() => json({ success: true, message: "Verified" }));
  assert.equal((await verifyEmail({ email: payload.email, otp: "123456" })).success, true);
  assert.equal(calls[0].url, `${API}/auth/verify-email`);
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: payload.email, otp: "123456" });

  const resendMessage = "If that account is awaiting verification, a new code has been sent.";
  calls = mockFetch(() => json({ success: true, message: resendMessage }));
  assert.equal((await resendOtp({ email: payload.email })).message, resendMessage);
  assert.equal(calls[0].url, `${API}/auth/resend-otp`);
  assert.equal(calls[0].options.headers.Authorization, undefined);
  mockFetch(() => json({ success: false, message: "Please try again later." }, 429));
  await assert.rejects(resendOtp({ email: payload.email }), /Please try again later/);

  // ---- Login: token extraction, cookie credentials, user from data.user ----
  calls = mockFetch(() => json(loginBody()));
  const login = await loginAccount({ email: payload.email, password: payload.password });
  assert.equal(calls[0].url, `${API}/auth/login`);
  assert.equal(calls[0].options.credentials, "include", "login must accept the refresh cookie");
  assert.equal(calls[0].options.headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: payload.email, password: payload.password });
  assert.deepEqual(login.data, account, "user comes from data.user");
  assert.equal("accessToken" in login.data, false, "token is not handed to UI state");
  assert.equal(hasAccessToken(), true);

  // Bearer header on protected requests; no cookies needed.
  calls = mockFetch(() => json({ success: true, data: { ...account, department: "B.Sc. Nautical Science" } }));
  assert.equal((await getCurrentUser()).id, "u1");
  assert.equal(calls[0].url, `${API}/auth/me`);
  assert.equal(calls[0].options.headers.Authorization, "Bearer jwt-login");
  assert.notEqual(calls[0].options.credentials, "include");

  // Older flat-only response shape still yields the account.
  mockFetch(() => json({ success: true, message: "Login successful", data: { ...account, accessToken: "jwt-flat", expiresIn: 900 } }));
  assert.equal((await loginAccount({ email: payload.email, password: payload.password })).data.id, "u1");

  // A login response without a token is rejected (e.g. backend not yet deployed).
  mockFetch(() => json({ success: true, message: "Login successful", data: account }));
  await assert.rejects(loginAccount({ email: payload.email, password: payload.password }), /did not return an access token/);

  // Wrong password: one request, no refresh attempt.
  calls = mockFetch(() => json({ success: false, message: "Invalid credentials" }, 401));
  await assert.rejects(loginAccount({ email: payload.email, password: "wrong" }), (error) => error instanceof AuthApiError && error.status === 401 && error.message === "Invalid credentials");
  assert.equal(calls.length, 1);
  mockFetch(() => json({ success: false, message: "Please verify your email before logging in" }, 403));
  await assert.rejects(loginAccount({ email: payload.email, password: payload.password }), (error) => error instanceof AuthApiError && error.status === 403 && error.message === "Please verify your email before logging in");
  mockFetch(() => json({ success: false, message: "Your account is awaiting admin approval" }, 403));
  await assert.rejects(loginAccount({ email: payload.email, password: payload.password }), /awaiting admin approval/);

  // ---- Logout: cookie credentials, token cleared ----
  mockFetch(() => json(loginBody("jwt-before-logout")));
  await loginAccount({ email: payload.email, password: payload.password });
  calls = mockFetch(() => json({ success: true, message: "Logged out", data: { loggedOut: true } }));
  await logoutAccount();
  assert.equal(calls[0].url, `${API}/auth/logout`);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(hasAccessToken(), false);

  // Logout failure is reported, and the local token is still cleared.
  mockFetch(() => json(loginBody("jwt-x")));
  await loginAccount({ email: payload.email, password: payload.password });
  mockFetch(() => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(logoutAccount(), /Could not reach the server/);
  assert.equal(hasAccessToken(), false);

  // ---- Session restoration after a page reload ----
  calls = mockFetch(
    () => json({ success: true, message: "Token refreshed", data: { refreshed: true, accessToken: "jwt-restored", expiresIn: 900 } }),
    () => json({ success: true, data: account }),
  );
  assert.equal((await restoreSession()).id, "u1");
  assert.equal(calls[0].url, `${API}/auth/refresh`);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(calls[1].url, `${API}/auth/me`);
  assert.equal(calls[1].options.headers.Authorization, "Bearer jwt-restored");

  // No refresh cookie: logged out, no /me call.
  await logoutAccountQuietly();
  calls = mockFetch(() => json({ success: false, message: "Refresh session is required" }, 401));
  assert.equal(await restoreSession(), null);
  assert.equal(calls.length, 1);
  assert.equal(hasAccessToken(), false);
  // Server unreachable: treated as logged out, not a crash.
  mockFetch(() => { throw new TypeError("Failed to fetch"); });
  assert.equal(await restoreSession(), null);
  // A refresh that "succeeds" without a token is not a session.
  mockFetch(() => json({ success: true, message: "Token refreshed", data: { refreshed: true } }));
  assert.equal(await restoreSession(), null);

  // ---- Tokens are never persisted ----
  for (const file of ["src/api/client.ts", "src/api/auth.ts", "src/context/auth/AuthContext.tsx"]) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|console\.(log|info|debug)/, `${file} must not persist or log tokens`);
  }

  console.log("Auth API checks passed (mocked): registration, login token extraction, Bearer header, wrong-password no-refresh, logout, session restoration, and no token persistence.");
} finally {
  globalThis.fetch = originalFetch;
}

async function logoutAccountQuietly() {
  mockFetch(() => json({ success: true, message: "Logged out", data: { loggedOut: true } }));
  await logoutAccount();
}
