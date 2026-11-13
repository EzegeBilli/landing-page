import Loader from "../../components/ui/loader/Loader";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventDate, eventKeys, eventStarted, eventTypes, getEvent, registrationStatus, safeEventUrl } from "../../api/events";
import { ApiError } from "../../api/client";
import { retryUnlessClientError } from "../../api/mentorship";
import { useAuth } from "../../context/auth/useAuth";
import { useEventAction, useMyEvents } from "./useEvents";
import styles from "./Events.module.css";

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  return <EventDetailContent key={`${id}:${user?.id ?? "anonymous"}`} />;
}

function EventDetailContent() {
  const { id = "" } = useParams();
  const { user, isLoading, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const validId = /^[a-f\d]{24}$/i.test(id);
  const detail = useQuery({ queryKey: eventKeys.detail(id, user?.id ?? "anonymous"), queryFn: () => getEvent(id), enabled: validId && !isLoading, retry: (count, error: Error) => retryUnlessClientError(count, error) });
  const mine = useMyEvents();
  const action = useEventAction(id);
  // Recompute start eligibility while the page stays open.
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const [feedback, setFeedback] = useState("");
  const event = detail.data;
  const registered = event && user && !isDemo ? registrationStatus(event, mine.isSuccess ? mine.data : undefined) : undefined;
  const perform = async () => {
    if (action.isPending) return;
    if (!user || isDemo) { navigate("/login", { state: { from: location.pathname + location.search } }); return; }
    if (registered === undefined) return;
    setFeedback("");
    try { const response = await action.mutateAsync(registered); setFeedback(response.message); } catch { /* Server error is rendered below, after reconciliation. */ }
  };
  const missing = !validId || (detail.error instanceof ApiError && detail.error.status === 404);
  return <section className={styles.events}><div className={styles.container}>
    <div className={styles.controls}><Link to="/events">All events</Link><Link to="/events/my-events">My events</Link></div>
    {missing ? <div><h1>Event unavailable</h1><p>This event may have been unpublished or removed.</p></div> : <>
      {(isLoading || detail.isPending) && <Loader label="Loading event..." />}
      {detail.isError && <p role="alert">{detail.error.message} <button onClick={() => void detail.refetch()}>Try again</button></p>}
      {event && !detail.isError && <article className={styles.detail}>
        <header className={`${styles.detailHero} ${!safeEventUrl(event.coverImageUrl) ? styles.noCover : ""}`}>
          <div className={styles.detailIntro}>
            <span className={styles.eyebrow}>{eventTypes[event.type] ?? "Alumni event"}</span>
            <h1>{event.title}</h1>
            <p>{eventDate(event.startDate)} &middot; {event.format} &middot; {eventStarted(event, now) ? "Past event" : "Upcoming event"}</p>
            <a href="#event-information" className={styles.detailJump}>Discover the event <span aria-hidden="true">↓</span></a>
          </div>
          {safeEventUrl(event.coverImageUrl) && <figure className={styles.coverFrame}><img className={styles.cover} src={safeEventUrl(event.coverImageUrl)} alt={event.title} /></figure>}
        </header>
        <div className={styles.detailBody} id="event-information">
        <div className={styles.eventOverview}>
        <span className={styles.eyebrow}>01 / The gathering</span>
        <h2>About this event</h2>
        <p className={styles.description}>{event.description || "Further event information will be shared by the organizer."}</p>
        </div>
        <aside className={styles.eventInformation} aria-label="Event information and registration">
        <span className={styles.eyebrow}>Plan your visit</span>
        <dl className={styles.facts}>
          <dt>Starts</dt><dd>{eventDate(event.startDate)} at {eventDate(event.startDate, true)} WAT (Africa/Lagos)</dd>
          {event.endDate && <><dt>Ends</dt><dd>{eventDate(event.endDate)} at {eventDate(event.endDate, true)} WAT</dd></>}
          <dt>Venue</dt><dd>{event.venue || (event.format === "virtual" ? "Online" : "To be confirmed")}</dd>
          {safeEventUrl(event.virtualLink) && <><dt>Online access</dt><dd><a href={safeEventUrl(event.virtualLink)} target="_blank" rel="noopener noreferrer">Join online</a></dd></>}
          <dt>Audience</dt><dd>{{ all: "Open to all", chapters: "Selected chapters", zone: "Zone restricted", invite: "Invitation only" }[event.openTo] ?? "Contact the organizer"}</dd>
          {event.chapters?.some(chapter => chapter?.name) && <><dt>Chapters</dt><dd>{event.chapters.filter(chapter => chapter?.name).map(chapter => chapter.name).join(", ")}</dd></>}
          <dt>Registrations</dt><dd>{event.registeredCount}</dd>
          <dt>Availability</dt><dd>{event.spotsLeft === null ? "Unlimited capacity" : `${event.spotsLeft} spots left`}</dd>
        </dl>
        <div className={styles.actions}>
          {user && !isDemo && registered === undefined && <>{mine.isError ? <p role="status">Could not confirm your registration status.</p> : <Loader inline label="Checking your registration..." />}</>}
          {mine.isError && <p role="alert">{mine.error.message} <button onClick={() => void mine.refetch()}>Retry registration check</button></p>}
          {registered && <p>You are registered for this event.</p>}
          {!registered && event.openTo === "invite" && <p>This event is by invitation only.</p>}
          {!registered && eventStarted(event, now) && <p>Registration is closed because this event has started.</p>}
          <button onClick={() => void perform()} disabled={action.isPending || isLoading || (!!user && !isDemo && registered === undefined) || (registered !== true && (eventStarted(event, now) || event.spotsLeft === 0 || event.openTo === "invite"))}>
            {action.isPending ? <Loader inline label="Updating registration..." /> : registered ? "Cancel registration" : !user || isDemo ? "Log in to register" : "Register for event"}
          </button>
          {!registered && event.spotsLeft === 0 && <p>This event is full.</p>}
          <p role="status" aria-live="polite">{feedback}</p>
          {action.isError && <p role="alert">{action.error.message}</p>}
        </div>
        </aside>
        </div>
      </article>}
    </>}
  </div></section>;
}
