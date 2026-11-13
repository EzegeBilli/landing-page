import Loader from "../../../ui/loader/Loader";
import { Link } from "react-router";
import { Anchor, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { eventDate, eventKeys, eventTypes, listEvents, safeEventUrl } from "../../../../api/events";
import { retryUnlessClientError } from "../../../../api/mentorship";
import styles from "./UpcomingEvents.module.css";
import { Button } from "../../../ui/button/Button";
const filters = { when: "upcoming", page: 1, limit: 3 } as const;
export default function UpcomingEvents() {
  const query = useQuery({ queryKey: eventKeys.list(filters), queryFn: () => listEvents(filters), retry: (count, error: Error) => retryUnlessClientError(count, error) });
  return <section className={styles.section}>
    <div className={styles.motif} aria-hidden="true"><Anchor size={400} /></div>
    <div className={styles.container}>
      <h2 className={styles.heading}>Reunions, Seminars &amp; Maritime Summits</h2>
      {query.isPending && <Loader label="Loading upcoming events..." />}
      {query.isError && <p role="alert">{query.error.message} <button onClick={() => void query.refetch()}>Try again</button></p>}
      {query.isSuccess && !query.data.events.length && <p>No upcoming events at the moment.</p>}
      <div className={styles.grid}>{query.data?.events.map(event => <div key={event._id} className={styles.card}>
        <div className={styles.imgWrap}>
          {safeEventUrl(event.coverImageUrl) && <img src={safeEventUrl(event.coverImageUrl)} alt={event.title} className={styles.img} loading="lazy" />}
          <div className={styles.dateBadge}>{eventDate(event.startDate)}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.tags}><span className={styles.tag}>{eventTypes[event.type] ?? "Event"}</span><span className={styles.tag}>{event.format}</span></div>
          <h3 className={styles.title}>{event.title}</h3>
          <div className={styles.location}><MapPin size={16} />{event.venue || (event.format === "virtual" ? "Online" : "Venue to be confirmed")}</div>
          <Link to={`/events/${event._id}`} className={styles.registerBtn}>View Details &amp; Register</Link>
        </div>
      </div>)}</div>
      <div className={styles.footer}><Link to="/events"><Button variant="ghost" size="lg">View All Events</Button></Link></div>
    </div>
  </section>;
}
