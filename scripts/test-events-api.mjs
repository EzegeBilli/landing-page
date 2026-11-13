import assert from "node:assert/strict";
import { loadTsModule } from "./load-ts-module.mjs";
globalThis.window ??= new EventTarget();
const client = await import(await loadTsModule("src/api/client.ts"));
const events = await import(await loadTsModule("src/api/events.ts"));
const original = globalThis.fetch;
let calls;
function mock(...responses) {
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    assert.ok(responses.length, `Unexpected request: ${url}`);
    return Response.json(...responses.shift());
  };
}
const ok = data => [{ success: true, message: "OK", data }];
const fail = (status, message) => [{ success: false, message }, { status }];
const id = "123456789012345678901234";
try {
  client.setAccessToken("token");
  const pagination = { total: 25, page: 2, limit: 12, pages: 3 };
  mock([{ success: true, data: [], pagination }]);
  const result = await events.listEvents({ page: 2, limit: 12, when: "past", type: "social", search: "Lagos & Warri" });
  assert.deepEqual(result.pagination, pagination);
  const url = new URL(calls[0].url);
  assert.equal(url.searchParams.get("search"), "Lagos & Warri");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("when"), "past");
  assert.equal(url.searchParams.get("type"), "social");
  assert.equal(calls[0].headers.Authorization, undefined);
  const detail = { _id: id, chapters: [{ _id: "chapter", name: "Lagos" }], registeredCount: 10, spotsLeft: null };
  mock(ok(detail));
  const loaded = await events.getEvent(id);
  assert.equal(calls[0].headers.Authorization, "Bearer token");
  assert.equal(events.registrationStatus(loaded), undefined);
  assert.equal(events.registrationStatus(loaded, []), false);
  assert.equal(events.registrationStatus(loaded, [{ _id: id }]), true);
  assert.equal(events.registrationStatus({ ...loaded, isRegistered: false }, [{ _id: id }]), true);
  mock(ok([{ _id: id, chapters: ["chapter"] }]));
  await events.getMyEvents();
  assert.equal(new URL(calls[0].url).pathname, "/api/events/me/registrations");
  assert.equal(new URL(calls[0].url).search, "");
  mock(ok({ ...detail, chapters: ["chapter"], isRegistered: true }));
  const registered = await events.registerForEvent(id);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].body, undefined);
  assert.deepEqual(registered.data.chapters, ["chapter"]);
  assert.deepEqual(loaded.chapters, [{ _id: "chapter", name: "Lagos" }]);
  mock(ok({ cancelled: true }));
  await events.cancelEventRegistration(id);
  assert.equal(calls[0].method, "DELETE");
  assert.equal(calls[0].body, undefined);
  for (const status of [400, 403, 404, 409, 429, 500]) {
    mock(fail(status, `Server message ${status}`));
    await assert.rejects(events.registerForEvent(id), error => error.status === status && error.message === `Server message ${status}`);
    assert.equal(calls.length, 1, "Errors other than 401 must not trigger refresh");
  }
  mock(fail(401, "Expired"), ok({ accessToken: "new-token" }), ok({ ...detail, isRegistered: true }));
  await events.registerForEvent(id);
  assert.equal(calls.length, 3);
  assert.ok(calls[1].url.endsWith("/auth/refresh"));
  assert.equal(calls[1].credentials, "include");
  assert.equal(calls[2].headers.Authorization, "Bearer new-token");
  mock(fail(401, "Expired"), ok({ accessToken: "retry-token" }), fail(401, "Expired again"));
  await assert.rejects(events.registerForEvent(id), error => error.status === 401);
  assert.equal(calls.length, 3, "Only one retry");
  mock(fail(404, "Event not found"));
  await assert.rejects(events.getEvent(id), /Event not found/);
  assert.equal(events.eventDate("2026-11-13T23:30:00Z"), "14 Nov 2026");
  assert.equal(events.eventStarted({ startDate: "2026-11-13T10:00:00Z", endDate: "2026-11-14T10:00:00Z" }, Date.parse("2026-11-13T11:00:00Z")), true);
  assert.equal(events.safeEventUrl("javascript:alert(1)"), undefined);
  assert.equal(events.safeEventUrl("https://example.com/event"), "https://example.com/event");
  console.log("Events API checks passed (mocked): pagination, filters, optional auth, unknown status, ID-only chapters, registration/cancellation, server errors, refresh, Lagos dates and safe URLs.");
} finally { globalThis.fetch = original; client.setAccessToken(null); }
