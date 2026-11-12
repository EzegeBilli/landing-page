import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Check, Mail, Users, X } from "lucide-react";
import styles from "./Profile.module.css";
import { toast } from "../../components/toast/toast";
import {
  getReceivedRequests,
  getSentRequests,
  mentorshipKeys,
  respondToRequest,
  retryUnlessClientError,
  statusLabel,
  type ApiMentorshipStatus,
} from "../../api/mentorship";

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

function StatusPill({ status }: { status: ApiMentorshipStatus }) {
  const { label, tone } = statusLabel(status);
  return <span className={`${styles.status} ${styles[tone]}`}>{label}</span>;
}

function LoadError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <p className={styles.formError} role="alert">
      {errorText(error)}{" "}
      <button type="button" className={styles.retryBtn} onClick={onRetry}>Retry</button>
    </p>
  );
}

interface Props {
  userId: string;
  isMentor: boolean;
  /** The demo account has no backend session, so it can't have real requests. */
  isDemo: boolean;
}

/** "Mentorship Requests Received" and "My Mentorship Requests" cards, backed by the API. */
export default function MentorshipRequests({ userId, isMentor, isDemo }: Props) {
  const queryClient = useQueryClient();

  const sent = useQuery({
    queryKey: mentorshipKeys.sent(userId),
    queryFn: getSentRequests,
    enabled: !isDemo,
    retry: retryUnlessClientError,
  });
  const received = useQuery({
    queryKey: mentorshipKeys.received(userId),
    queryFn: getReceivedRequests,
    enabled: !isDemo,
    retry: retryUnlessClientError,
  });

  const respond = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accepted" | "declined" }) => respondToRequest(id, status),
    retry: false,
    onSuccess: (_data, { status }) => {
      toast.success(status === "accepted" ? "Request accepted." : "Request declined.");
    },
    onError: (error) => toast.error(errorText(error)),
    // Reload either way: on a 409 the request was already answered elsewhere.
    onSettled: () => queryClient.invalidateQueries({ queryKey: mentorshipKeys.received(userId) }),
  });

  const handleRespond = (id: string, status: "accepted" | "declined") => {
    if (respond.isPending) return;
    respond.mutate({ id, status });
  };
  const busyId = respond.isPending ? respond.variables?.id : undefined;

  // Mentors who switched mentoring off may still have requests to answer.
  const showReceived = !isDemo && (isMentor || (received.data?.length ?? 0) > 0);

  return (
    <>
      {showReceived && (
        <div className={styles.card}>
          <h2>Mentorship Requests Received</h2>
          {received.isPending && <p className={styles.empty} role="status">Loading requests…</p>}
          {received.isError && <LoadError error={received.error} onRetry={() => void received.refetch()} />}
          {received.isSuccess && (received.data.length === 0 ? (
            <p className={styles.empty}>No requests yet.</p>
          ) : (
            <ul className={styles.receivedList}>
              {received.data.map((r) => {
                const pending = r.status === "pending" || r.status === "requested";
                const accepted = r.status === "accepted" || r.status === "active";
                return (
                  <li key={r.id}>
                    <div className={styles.receivedHeader}>
                      <strong>{r.requesterName || "NMU member"}</strong>
                      <StatusPill status={r.status} />
                    </div>
                    <p className={styles.receivedMessage}>{r.message}</p>

                    {pending ? (
                      <div className={styles.receivedActions}>
                        <button
                          type="button"
                          className={styles.acceptBtn}
                          disabled={respond.isPending}
                          onClick={() => handleRespond(r.id, "accepted")}
                        >
                          <Check size={13} /> {busyId === r.id ? "Saving…" : "Accept"}
                        </button>
                        <button
                          type="button"
                          className={styles.declineBtn}
                          disabled={respond.isPending}
                          onClick={() => handleRespond(r.id, "declined")}
                        >
                          <X size={13} /> Decline
                        </button>
                      </div>
                    ) : accepted && r.requesterEmail ? (
                      <a href={`mailto:${r.requesterEmail}`} className={styles.contactLink}>
                        <Mail size={13} /> {r.requesterEmail}
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      )}

      <div className={styles.card}>
        <h2>My Mentorship Requests</h2>
        {isDemo ? (
          <p className={styles.empty}>
            Mentorship requests are available to registered members. The demo account can't send them.
          </p>
        ) : (
          <>
            {sent.isPending && <p className={styles.empty} role="status">Loading requests…</p>}
            {sent.isError && <LoadError error={sent.error} onRetry={() => void sent.refetch()} />}
            {sent.isSuccess && (sent.data.length === 0 ? (
              <p className={styles.empty}>You haven't requested a mentor yet.</p>
            ) : (
              <ul className={styles.requestList}>
                {sent.data.map((r) => (
                  <li key={r.id}>
                    <div className={styles.receivedHeader}>
                      <strong>{r.mentorName || "Mentor"}</strong>
                      <StatusPill status={r.status} />
                    </div>
                    {r.mentorEmail && (
                      <a href={`mailto:${r.mentorEmail}`} className={styles.contactLink}>
                        <Mail size={13} /> {r.mentorEmail}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </>
        )}
        <Link to="/mentorship" className={styles.sidebarLink}>
          <Users size={15} /> Find a Mentor
        </Link>
      </div>
    </>
  );
}
