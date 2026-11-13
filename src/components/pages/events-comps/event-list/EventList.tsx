import EventCard from "../event-card/EventCard";
import type { EventFields } from "../../../../api/events";
import styles from "./EventList.module.css";
export default function EventList({ events }: { events: EventFields[] }) {
  return <div className={styles.grid}>{events.map(event => <EventCard key={event._id} event={event} />)}</div>;
}
