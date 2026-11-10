import { ApiError, apiRequest } from "./client";

/** React Query keys. Per-user keys include the user id so caches never leak across accounts. */
export const mentorshipKeys = {
  mentors: (filters: MentorFilters) => ["mentors", filters] as const,
  sent: (userId: string) => ["mentorship", "sent", userId] as const,
  received: (userId: string) => ["mentorship", "received", userId] as const,
};

/** Retry network/server failures twice; never retry 4xx responses. */
export const retryUnlessClientError = (failureCount: number, error: unknown) =>
  !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2;

/** Public mentor record from GET /api/mentors (never includes email). */
export interface ApiMentor {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  currentRole: string | null;
  company: string | null;
  location: string | null;
  department: string | null;
  discipline: string | null;
  faculty: string | null;
  graduationYear: number | null;
  bio: string | null;
  linkedin: string | null;
  mentorExpertise: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface MentorFilters {
  department?: string;
  discipline?: string;
  expertise?: string;
  search?: string;
  location?: string;
  page?: number;
  limit?: number;
}

/** `requested`/`active` are legacy values still returned for older records. */
export type ApiMentorshipStatus =
  | "pending" | "accepted" | "declined" | "cancelled" | "completed" | "requested" | "active";

export interface SentRequest {
  id: string;
  mentorId: string | null;
  mentorName: string | null;
  message: string;
  status: ApiMentorshipStatus;
  createdAt: string;
  /** Only present once the request is accepted. */
  mentorEmail?: string;
}

export interface ReceivedRequest {
  id: string;
  requesterId: string | null;
  requesterName: string | null;
  message: string;
  status: ApiMentorshipStatus;
  createdAt: string;
  /** Only present once the request is accepted. */
  requesterEmail?: string;
}

export const listMentors = (filters: MentorFilters = {}) =>
  apiRequest<{ items: ApiMentor[]; pagination: Pagination }>("/mentors", { query: { ...filters } })
    .then(({ data }) => data);

export const sendMentorshipRequest = (payload: { mentorId: string; message: string; focusArea?: string }) =>
  apiRequest<unknown>("/mentorship/requests", { method: "POST", body: payload });

export const getSentRequests = () =>
  apiRequest<SentRequest[]>("/mentorship/requests/sent").then(({ data }) => data);

export const getReceivedRequests = () =>
  apiRequest<ReceivedRequest[]>("/mentorship/requests/received").then(({ data }) => data);

export const respondToRequest = (id: string, status: "accepted" | "declined") =>
  apiRequest<unknown>(`/mentorship/requests/${encodeURIComponent(id)}`, { method: "PATCH", body: { status } });

/** Statuses that still block a new request to the same mentor. */
export const OPEN_STATUSES: ApiMentorshipStatus[] = ["pending", "requested", "accepted", "active"];

/** Display label + style key for a backend status. */
export function statusLabel(status: ApiMentorshipStatus): { label: string; tone: "pending" | "accepted" | "declined" } {
  switch (status) {
    case "pending":
    case "requested":
      return { label: "Pending", tone: "pending" };
    case "accepted":
    case "active":
      return { label: "Accepted", tone: "accepted" };
    case "completed":
      return { label: "Completed", tone: "accepted" };
    case "cancelled":
      return { label: "Cancelled", tone: "declined" };
    default:
      return { label: "Declined", tone: "declined" };
  }
}
