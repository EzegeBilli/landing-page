import { apiRequest } from "./client";

export const eventTypes = { nga: "NGA", nec_meeting: "NEC meeting", bot_meeting: "Board of Trustees meeting", chapter_meeting: "Chapter meeting", career_fair: "Career fair", summit: "Summit", webinar: "Webinar", social: "Social" } as const;
export type EventType = keyof typeof eventTypes;
export interface EventFields {
  _id: string; title: string; description?: string; type: EventType; isNga: boolean;
  format: "physical" | "virtual" | "hybrid"; venue?: string; virtualLink?: string;
  startDate: string; endDate?: string; openTo: "all" | "chapters" | "zone" | "invite";
  coverImageUrl?: string; capacity?: number | null; isPublished: boolean;
  publishedAt?: string | null; createdAt: string; updatedAt: string; __v?: number;
}
export interface PublicEvent extends EventFields { chapters: { _id: string; name: string }[] }
export interface EventDetail extends PublicEvent { registeredCount: number; spotsLeft: number | null; isRegistered?: boolean }
export interface RegisteredEvent extends EventFields { chapters: string[] }
export interface RegistrationResult extends RegisteredEvent { registeredCount: number; spotsLeft: number | null; isRegistered: true }
export interface EventFilters { page?: number; limit?: number; when?: "upcoming" | "past" | "all"; type?: EventType; search?: string }
export const eventKeys = {
  list: (filters: EventFilters) => ["events", "list", filters] as const,
  detail: (id: string, account: string) => ["event-member", account, "detail", id] as const,
  mine: (account: string) => ["event-member", account, "registrations"] as const,
};
export async function listEvents(filters: EventFilters = {}) {
  const response = await apiRequest<PublicEvent[]>("/events", { auth: false, query: { ...filters } });
  if (!response.pagination) throw new Error("The server did not return event pagination. Please try again.");
  return { events: response.data, pagination: response.pagination };
}
export const getEvent = (id: string) => apiRequest<EventDetail>(`/events/${encodeURIComponent(id)}`).then(r => r.data);
export const getMyEvents = () => apiRequest<RegisteredEvent[]>("/events/me/registrations").then(r => r.data);
export const registerForEvent = (id: string) => apiRequest<RegistrationResult>(`/events/${encodeURIComponent(id)}/register`, { method: "POST" });
export const cancelEventRegistration = (id: string) => apiRequest<{ cancelled: true }>(`/events/${encodeURIComponent(id)}/register`, { method: "DELETE" });
export const eventStarted = (event: EventFields, now = Date.now()) => Date.parse(event.startDate) <= now;
export function eventDate(value: string, timeOnly = false) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", ...(timeOnly ? { hour: "2-digit", minute: "2-digit" } as const : { day: "numeric", month: "short", year: "numeric" } as const) }).format(date);
}
export function safeEventUrl(value?: string) {
  try { const url = new URL(value ?? ""); return ["https:", "http:"].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
export function registrationStatus(detail: EventDetail, mine?: RegisteredEvent[]): boolean | undefined {
  // The authenticated lookup is authoritative even when optional detail auth silently fails.
  return mine ? mine.some(event => event._id === detail._id) : detail.isRegistered;
}
