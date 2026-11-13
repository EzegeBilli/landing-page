import Loader from "../../components/ui/loader/Loader";
import { Link } from "react-router-dom";
import { eventDate, type RegisteredEvent } from "../../api/events";
import { useAuth } from "../../context/auth/useAuth";
import { useEventAction, useMyEvents } from "./useEvents";
import styles from "./Events.module.css";
function Registration({ event }: { event: RegisteredEvent }) {
  const action = useEventAction(event._id);
  return <article className={styles.registration}><h2><Link to={`/events/${event._id}`}>{event.title}</Link></h2>
    <p>{eventDate(event.startDate)} at {eventDate(event.startDate, true)} WAT · {event.venue || event.format}</p>
    <button disabled={action.isPending} onClick={() => action.mutate(true)}>{action.isPending ? <Loader inline label="Cancelling..." /> : "Cancel registration"}</button>
    {action.isError && <p role="alert">{action.error.message}</p>}
  </article>;
}
export default function MyEvents() {
  const { isDemo } = useAuth();
  const query = useMyEvents();
  return <section className={styles.events}><div className={styles.container}>
    <div className={styles.header}><h1>My events</h1><p>Your registered alumni events. All times are in Africa/Lagos.</p><Link to="/events">Browse events</Link></div>
    {isDemo ? <p>Please <Link to="/login" state={{ from: "/events/my-events" }}>log in with a member account</Link> to view your registrations.</p> : <>
      {query.isPending && <Loader label="Loading your events..." />}
      {query.isError && <p role="alert">{query.error.message} <button onClick={() => void query.refetch()}>Try again</button></p>}
      {query.isSuccess && <><p role="status" aria-live="polite">{query.data.length ? `${query.data.length} registered events` : "You have no published event registrations."}</p><p>Unpublished events are not shown here.</p>{query.data.map(event => <Registration key={event._id} event={event} />)}</>}
    </>}
  </div></section>;
}
