import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toastStore, type Toast } from "./toast";
import styles from "./Toasts.module.css";

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info } as const;
const EXIT_MS = 180;

function ToastItem({ item }: { item: Toast }) {
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  const close = () => {
    setLeaving(true);
    window.setTimeout(() => toastStore.dismiss(item.id), EXIT_MS);
  };

  // Auto-dismiss; pausing keeps the time that was left.
  useEffect(() => {
    if (paused || leaving) return;
    startedAt.current = performance.now();
    const timer = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(() => toastStore.dismiss(item.id), EXIT_MS);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= performance.now() - startedAt.current;
    };
  }, [paused, leaving, item.id]);

  const Icon = ICONS[item.type];
  return (
    <div
      className={`${styles.toast} ${styles[item.type]} ${leaving ? styles.leaving : ""}`}
      role={item.type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className={styles.icon} aria-hidden="true"><Icon size={18} strokeWidth={2.25} /></span>
      <div className={styles.body}>
        <strong>{item.title}</strong>
        <p>{item.message}</p>
      </div>
      <button type="button" className={styles.close} aria-label="Dismiss notification" onClick={close}>
        <X size={16} strokeWidth={2.25} />
      </button>
      <span
        className={styles.timer}
        style={{ animationDuration: `${item.duration}ms`, animationPlayState: paused ? "paused" : "running" }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function Toasts() {
  const items = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot);
  return (
    <section className={styles.stack} aria-label="Notifications">
      {items.map((item) => <ToastItem key={item.id} item={item} />)}
    </section>
  );
}
