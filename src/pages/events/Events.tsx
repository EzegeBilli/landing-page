import Loader from "../../components/ui/loader/Loader";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventKeys, eventTypes, listEvents, type EventFilters, type EventType } from "../../api/events";
import { retryUnlessClientError } from "../../api/mentorship";
import EventList from "../../components/pages/events-comps/event-list/EventList";
import styles from "./Events.module.css";
export default function Events() {
  const [filters, setFilters] = useState<EventFilters>({ page: 1, limit: 12, when: "upcoming" });
  const update = (values: EventFilters) => setFilters(previous => ({ ...previous, ...values, page: 1 }));
  const query = useQuery({ queryKey: eventKeys.list(filters), queryFn: () => listEvents(filters), retry: (count, error: Error) => retryUnlessClientError(count, error) });
  return <section className={styles.events}>
    <header className={styles.hero}><div className={styles.container}>
      <span className={styles.eyebrow}>The alumni calendar</span>
      <h1>Shared moments.<br /><em>Lasting connections.</em></h1>
      <p>Reconnect with your community through reunions, conversations and gatherings that bring our maritime network together.</p>
      <div className={styles.heroActions}><a href="#event-calendar">Explore events <span aria-hidden="true">↓</span></a><Link to="/events/my-events">My events</Link></div>
    </div></header>
    <div className={styles.container} id="event-calendar">
    <div className={styles.sectionHeading}><span className={styles.eyebrow}>01 / Come together</span><h2>Find your next gathering</h2><p>Browse the calendar. All event times are shown in Africa/Lagos.</p></div>
    <div className={styles.controls}>
      <label>Search events<input type="search" value={filters.search ?? ""} onChange={e => update({ search: e.target.value })} placeholder="Title or venue" /></label>
      <label>When<select value={filters.when} onChange={e => update({ when: e.target.value as EventFilters["when"] })}><option value="upcoming">Upcoming</option><option value="past">Past</option><option value="all">All events</option></select></label>
      <label>Event type<select value={filters.type ?? ""} onChange={e => update({ type: (e.target.value || undefined) as EventType | undefined })}><option value="">All types</option>{Object.entries(eventTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    {query.isPending && <Loader label="Loading events..." />}
    {query.isError && <p role="alert">{query.error.message} <button onClick={() => void query.refetch()}>Try again</button></p>}
    {query.isSuccess && <>{query.data.events.length ? <EventList events={query.data.events} /> : <p>No events match your filters.</p>}
      <nav className={styles.controls} aria-label="Event pages"><button disabled={(filters.page ?? 1) <= 1 || query.isFetching} onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) - 1 }))}>Previous</button><span aria-live="polite">Page {query.data.pagination.page} of {Math.max(1, query.data.pagination.pages)}</span><button disabled={query.data.pagination.page >= query.data.pagination.pages || query.isFetching} onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) + 1 }))}>Next</button></nav>
    </>}
  </div></section>;
}
