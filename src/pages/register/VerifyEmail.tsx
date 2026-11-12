import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Register from "./Register";
import styles from "./Register.module.css";
import AuthSidePanel from "../../components/auth-comps/auth-side-panel/AuthSidePanel";
import logo from "../../assets/images/svg/nmulogo.png";

export default function VerifyEmail() {
  const location = useLocation();
  const [email, setEmail] = useState(() => (location.state as { email?: string } | null)?.email || sessionStorage.getItem("nmu_verification_email") || "");
  const [selectedEmail, setSelectedEmail] = useState(email);
  if (selectedEmail) return <Register key={selectedEmail} verificationEmail={selectedEmail} />;
  return <div className={styles.page}>
    <div className={styles.formCol}><div className={styles.formWrap}>
      <Link to="/" className={styles.logoLink}><img src={logo} alt="NMU Alumni Association" /></Link>
      <h1 className={styles.title}>Verify your email</h1>
      <p className={styles.subtitle}>Enter the email address you registered with. You can use your latest code or request a new one on the next screen.</p>
      <form className={styles.form} onSubmit={event => {
        event.preventDefault();
        const normalized = email.trim().toLowerCase();
        sessionStorage.setItem("nmu_verification_email", normalized);
        setSelectedEmail(normalized);
      }}>
        <div className={styles.field}><label htmlFor="verification-email">Email address</label><div className={styles.inputWrap}>
          <input id="verification-email" className={styles.noIconSelect} type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} />
        </div></div>
        <button type="submit" className={styles.nextBtn}>Continue</button>
      </form>
      <p className={styles.footerText}><Link to="/login" className={styles.link}>Back to login</Link></p>
    </div></div><AuthSidePanel />
  </div>;
}
