import logo from "../../../assets/images/svg/nmulogo.png";
import styles from "./Loader.module.css";

export function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />;
}

export default function Loader({ label = "Loading...", inline = false }: { label?: string; inline?: boolean }) {
  if (inline) return <span className={styles.inline} role="status"><Spinner /><span>{label}</span></span>;
  return <div className={styles.loader} role="status">
    <span className={styles.emblem}><img src={logo} alt="" /><span className={styles.ring} aria-hidden="true" /></span>
    <span className={styles.label}>{label}</span>
  </div>;
}
