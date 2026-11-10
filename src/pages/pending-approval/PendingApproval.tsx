import { Link, useLocation } from "react-router-dom";
import { Check, Clock, Home, LogIn, Mail } from "lucide-react";
import AuthSidePanel from "../../components/auth-comps/auth-side-panel/AuthSidePanel";
import logo from "../../assets/images/svg/nmulogo.png";
import styles from "./PendingApproval.module.css";

const SUPPORT_EMAIL = "info@nmuaa.org.ng";

const steps = [
  { label: "Account created", done: true },
  { label: "Email verified", done: true },
  { label: "Admin review", done: false },
];

const PendingApproval = () => {
  const location = useLocation();
  const state = location.state as { email?: string; justVerified?: boolean } | null;
  const email = state?.email;

  return (
    <div className={styles.page}>
      <div className={styles.col}>
        <div className={styles.wrap}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="NMU Alumni Association" />
          </Link>

          <div className={styles.badge} aria-hidden="true">
            <Clock size={26} strokeWidth={2} />
          </div>

          <h1 className={styles.title}>
            {state?.justVerified ? "Email verified. One last step." : "Your account is awaiting approval"}
          </h1>
          <p className={styles.lead} role="status">
            An administrator is reviewing your membership details
            {email ? <> for <strong>{email}</strong></> : null}. You’ll be able to log in as soon as your account is
            approved.
          </p>

          <ol className={styles.steps} aria-label="Registration progress">
            {steps.map((s) => (
              <li key={s.label} className={s.done ? styles.done : styles.current} aria-current={s.done ? undefined : "step"}>
                <span className={styles.dot} aria-hidden="true">
                  {s.done ? <Check size={14} strokeWidth={3} /> : <span className={styles.pulse} />}
                </span>
                <span className={styles.stepLabel}>
                  {s.label}
                  <small>{s.done ? "Complete" : "In progress"}</small>
                </span>
              </li>
            ))}
          </ol>

          <div className={styles.note}>
            <h2>What happens next</h2>
            <ul>
              <li>An administrator reviews the details you registered with.</li>
              <li>Once approved, log in with the same email and password.</li>
              <li>If anything needs clarifying, the secretariat may contact you by email.</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <Link to="/login" className={styles.primary}>
              <LogIn size={18} strokeWidth={2.25} aria-hidden="true" /> Try logging in
            </Link>
            <Link to="/" className={styles.secondary}>
              <Home size={18} strokeWidth={2.25} aria-hidden="true" /> Back to home
            </Link>
          </div>

          <p className={styles.help}>
            <Mail size={15} aria-hidden="true" /> Waiting longer than expected?{" "}
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Account%20approval`}>Contact the secretariat</a>
          </p>
        </div>
      </div>
      <AuthSidePanel />
    </div>
  );
};

export default PendingApproval;
