import { Link } from "react-router-dom";
import styles from "./JoinNetworkSection.module.css";

const JoinNetworkSection = () => {
  return (
    <section className={styles.section} aria-labelledby="join-title">
      <div className={styles.inner}>
        <div>
          <span className={styles.kicker}>Membership</span>
          <h2 id="join-title">Ready to join the NMUAA network?</h2>
        </div>
        <div className={styles.side}>
          <p>
            Become part of the alumni association of Nigeria’s first maritime university. Connect with fellow
            graduates, access career opportunities, and help shape the future of Nigeria’s blue economy.
          </p>
          <div className={styles.buttons}>
            <Link to="/register" className={styles.primary}>Register now <span aria-hidden="true">→</span></Link>
            <a href="#membership" className={styles.secondary}>Compare membership</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinNetworkSection;
