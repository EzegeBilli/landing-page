import type { EventFields } from "../../../../api/events";
import { eventDate, eventStarted, safeEventUrl } from "../../../../api/events";
import styles from "./EventCard.module.css";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const EventCard = ({ event }: { event: EventFields }) => {
  const image = safeEventUrl(event.coverImageUrl);
  return <article className={styles.card}>
    <div className={styles.imageContainer}>
      <span className={styles.badge}>{eventStarted(event) ? "Past" : "Upcoming"}</span>
      {image && <img src={image} alt={event.title} loading="lazy" />}
    </div>
    <div className={styles.content}><div><h3>{event.title}</h3>
      <div className={styles.info}>
        <div><Calendar size={16} /><span>{eventDate(event.startDate)}</span></div>
        <div><Clock size={16} /><span>{eventDate(event.startDate, true)} WAT</span></div>
        <div><MapPin size={16} /><span>{event.venue || (event.format === "virtual" ? "Online" : "Venue to be confirmed")}</span></div>
      </div></div>
      <Link to={`/events/${event._id}`} className={styles.link}>View Details &amp; Register <ArrowRight size={16} /></Link>
    </div>
  </article>;
};
export default EventCard;
