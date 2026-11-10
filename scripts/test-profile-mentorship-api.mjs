// Contract checks for the profile and mentorship API layer against the shapes
// documented in the backend's API_DOCUMENTATION.md. Uses a mocked fetch.
import assert from "node:assert/strict";
import { loadTsModule } from "./load-ts-module.mjs";

globalThis.window ??= new EventTarget();
const API = "http://localhost:5000/api";

const { ApiError, SESSION_EXPIRED_EVENT } = await import(await loadTsModule("src/api/client.ts"));
const profile = await import(await loadTsModule("src/api/profile.ts"));
const mentorship = await import(await loadTsModule("src/api/mentorship.ts"));
const { profilePatch } = await import(await loadTsModule("src/api/profilePatch.ts"));

const originalFetch = globalThis.fetch;
/** Installs a fetch mock that serves `handlers` in order and records each call. */
function mockFetch(...handlers) {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options, body: options.body ? JSON.parse(options.body) : undefined });
    const handler = handlers.shift();
    assert.ok(handler, `unexpected extra request to ${url}`);
    return handler(url, options);
  };
  return calls;
}
const ok = (data, message = "OK", status = 200) => () => Response.json({ success: true, message, data }, { status });
const fail = (status, message, details) => () => Response.json({ success: false, message, details }, { status });

try {
  // ---- Profile ----
  let calls = mockFetch(ok({ _id: "u1" }, "Profile updated"));
  await profile.updateMyProfile({ fullName: "Ada Obi", graduationYear: 2022, bio: null });
  assert.equal(calls[0].url, `${API}/users/me`);
  assert.equal(calls[0].options.method, "PATCH");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(calls[0].body, { fullName: "Ada Obi", graduationYear: 2022, bio: null });

  calls = mockFetch(ok({ avatarUrl: "https://res.cloudinary.com/x.jpg" }, "Profile avatar updated"));
  const avatar = await profile.uploadMyAvatar("data:image/jpeg;base64,/9j/AA==");
  assert.equal(calls[0].url, `${API}/users/me/avatar`);
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(calls[0].body, { data: "data:image/jpeg;base64,/9j/AA==" });
  assert.equal(avatar.data.avatarUrl, "https://res.cloudinary.com/x.jpg");

  calls = mockFetch(ok({ isMentor: true, mentorExpertise: ["Watchkeeping"] }));
  await profile.updateMyMentorSettings({ isMentor: true, mentorExpertise: ["Watchkeeping"] });
  assert.equal(calls[0].url, `${API}/users/me/mentor`);
  assert.equal(calls[0].options.method, "PATCH");
  assert.deepEqual(calls[0].body, { isMentor: true, mentorExpertise: ["Watchkeeping"] });

  // Zod validation errors are surfaced with their field messages.
  mockFetch(fail(400, "Validation failed", { formErrors: [], fieldErrors: { fullName: ["String must contain at least 2 character(s)"] } }));
  await assert.rejects(profile.updateMyProfile({ fullName: "A" }), (error) =>
    error instanceof ApiError && error.status === 400 && /Validation failed: fullName: String must contain/.test(error.message));
  mockFetch(fail(503, "Image uploads are not configured on this server"));
  await assert.rejects(profile.uploadMyAvatar("data:image/png;base64,iVBORw0KGgo="), /Image uploads are not configured/);

  // ---- Field conversion + protected fields ----
  const current = { fullName: "Ada Obi", discipline: "B.Sc. Nautical Science", graduationYear: "2022", company: "NLNG", bio: "Hi" };
  const form = { fullName: " Ada Obi ", discipline: "B.Sc. Port Management", graduationYear: "2023", currentRole: "", company: "NLNG", location: " Lagos ", phone: "", bio: "" };
  assert.deepEqual(profilePatch(current, form), {
    department: "B.Sc. Port Management", graduationYear: 2023, location: "Lagos", bio: null,
  });
  assert.deepEqual(profilePatch(current, { ...form, discipline: current.discipline, graduationYear: "", location: "", bio: "Hi" }), { graduationYear: null });
  const unchanged = { fullName: "Ada Obi", discipline: "B.Sc. Nautical Science", graduationYear: "2022", currentRole: "", company: "NLNG", location: "", phone: "", bio: "Hi" };
  assert.deepEqual(profilePatch(current, unchanged), {});
  for (const key of Object.keys(profilePatch(current, form))) {
    assert.ok(!["email", "userType", "membershipType", "role", "avatarUrl", "isMentor"].includes(key));
  }

  // ---- Session refresh ----
  calls = mockFetch(fail(401, "Token expired"), ok({ refreshed: true }), ok({ items: [], pagination: { total: 0, page: 1, limit: 20, pages: 1 } }));
  await mentorship.listMentors();
  assert.deepEqual(calls.map((c) => c.url), [`${API}/mentors`, `${API}/auth/refresh`, `${API}/mentors`]);
  assert.equal(calls[1].options.method, "POST");
  assert.equal(calls[1].options.credentials, "include");

  let expired = 0;
  window.addEventListener(SESSION_EXPIRED_EVENT, () => { expired += 1; });
  mockFetch(fail(401, "Token expired"), fail(401, "Invalid refresh token"));
  await assert.rejects(mentorship.getSentRequests(), (error) => error instanceof ApiError && error.status === 401 && /session has expired/.test(error.message));
  assert.equal(expired, 1);

  // Concurrent 401s share a single refresh call.
  calls = mockFetch(fail(401, "x"), fail(401, "x"), ok({ refreshed: true }), ok([]), ok([]));
  await Promise.all([mentorship.getSentRequests(), mentorship.getReceivedRequests()]);
  assert.equal(calls.filter((c) => c.url.endsWith("/auth/refresh")).length, 1);

  // ---- Mentor discovery ----
  const mentor = { id: "a".repeat(24), fullName: "Capt. Bello", avatarUrl: null, currentRole: "Master", company: null, location: "Lagos", department: "B.Sc. Nautical Science", discipline: "B.Sc. Nautical Science", faculty: null, graduationYear: 2020, bio: null, linkedin: null, mentorExpertise: ["Watchkeeping"] };
  calls = mockFetch(ok({ items: [mentor], pagination: { total: 1, page: 2, limit: 12, pages: 3 } }, "Mentors retrieved"));
  const result = await mentorship.listMentors({ department: "B.Sc. Nautical Science", search: "", expertise: undefined, page: 2, limit: 12 });
  const query = new URL(calls[0].url).searchParams;
  assert.equal(query.get("department"), "B.Sc. Nautical Science");
  assert.equal(query.get("page"), "2");
  assert.equal(query.get("limit"), "12");
  assert.equal(query.has("search"), false, "empty filters are omitted");
  assert.equal(query.has("expertise"), false);
  assert.equal(result.items[0].fullName, "Capt. Bello");
  assert.equal(result.pagination.pages, 3);
  assert.equal("email" in result.items[0], false);

  // ---- Mentorship requests ----
  calls = mockFetch(ok({ _id: "r1", status: "pending" }, "Mentorship request sent", 201));
  await mentorship.sendMentorshipRequest({ mentorId: mentor.id, message: "I would like guidance." });
  assert.equal(calls[0].url, `${API}/mentorship/requests`);
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(calls[0].body, { mentorId: mentor.id, message: "I would like guidance." });

  mockFetch(fail(409, "You already have an open request or mentorship with this mentor"));
  await assert.rejects(mentorship.sendMentorshipRequest({ mentorId: mentor.id, message: "Again" }),
    (error) => error instanceof ApiError && error.status === 409 && /already have an open request/.test(error.message));

  calls = mockFetch(ok([{ id: "r1", mentorId: mentor.id, mentorName: "Capt. Bello", message: "Hi", status: "pending", createdAt: "2026-11-10T00:00:00Z" }], "Sent requests retrieved"));
  const sent = await mentorship.getSentRequests();
  assert.equal(calls[0].url, `${API}/mentorship/requests/sent`);
  assert.equal(sent[0].status, "pending");
  assert.equal(sent[0].mentorEmail, undefined, "no contact details before acceptance");

  calls = mockFetch(ok([{ id: "r1", requesterId: "b".repeat(24), requesterName: "Ada", message: "Hi", status: "accepted", createdAt: "2026-11-10T00:00:00Z", requesterEmail: "ada@example.com" }]));
  const received = await mentorship.getReceivedRequests();
  assert.equal(calls[0].url, `${API}/mentorship/requests/received`);
  assert.equal(received[0].requesterEmail, "ada@example.com");

  calls = mockFetch(ok({ _id: "r1", status: "accepted" }, "Mentorship request accepted"));
  await mentorship.respondToRequest("r1", "accepted");
  assert.equal(calls[0].url, `${API}/mentorship/requests/r1`);
  assert.equal(calls[0].options.method, "PATCH");
  assert.deepEqual(calls[0].body, { status: "accepted" });

  mockFetch(fail(403, "Only the mentor can respond to this request"));
  await assert.rejects(mentorship.respondToRequest("r1", "declined"), /Only the mentor can respond/);

  // ---- Status mapping + retry policy ----
  assert.equal(mentorship.statusLabel("pending").label, "Pending");
  assert.equal(mentorship.statusLabel("requested").label, "Pending");
  assert.equal(mentorship.statusLabel("active").label, "Accepted");
  assert.equal(mentorship.statusLabel("declined").tone, "declined");
  assert.equal(mentorship.statusLabel("cancelled").label, "Cancelled");
  assert.equal(mentorship.statusLabel("completed").label, "Completed");
  assert.equal(mentorship.retryUnlessClientError(0, new ApiError("x", 404)), false);
  assert.equal(mentorship.retryUnlessClientError(0, new ApiError("x", 503)), true);
  assert.equal(mentorship.retryUnlessClientError(2, new ApiError("x", 0)), false);

  console.log("Profile & mentorship API checks passed: profile/avatar/mentor writes, field conversion, validation errors, token refresh, session expiry, discovery filters, requests, statuses, and contact privacy.");
} finally {
  globalThis.fetch = originalFetch;
}
