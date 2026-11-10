import { Link } from "react-router-dom";
import shared from "../aboutShared.module.css";
import styles from "./MembershipCategoriesSection.module.css";
import { MEMBERSHIP_DUES, formatDues } from "../../../../constants/Membership";

type Tier = {
  key: string;
  name: string;
  who: string;
  benefits: string[];
  note?: string;
  price: string;
  priceNote?: string;
  cta?: string;
  footnote?: string;
  variant?: "honorary";
};

const tiers: Tier[] = [
  {
    key: "full",
    name: "Full Member",
    who: "Open to all graduates of Nigeria Maritime University, Okerenkoko who have successfully completed a recognised degree or postgraduate programme.",
    benefits: ["Vote in elections", "Contest elected offices", "Access welfare benefits", "Receive official communications"],
    price: formatDues(MEMBERSHIP_DUES.Full.NGN, "NGN"),
    priceNote: `or USD ${MEMBERSHIP_DUES.Full.USD} for diaspora members`,
    cta: "Join as a Full Member",
  },
  {
    key: "associate",
    name: "Associate Member",
    who: "Open to former academic and administrative staff of NMU, industry experts with sustained engagement with the University, and persons who completed non-degree programmes.",
    benefits: ["Receive official communications", "Attend association events", "Contribute to the network"],
    note: "Cannot vote or contest elections.",
    price: formatDues(MEMBERSHIP_DUES.Associate.NGN, "NGN"),
    cta: "Join as an Associate",
  },
  {
    key: "honorary",
    name: "Honorary Member",
    who: "Conferred by the National General Assembly upon persons of distinguished repute who have rendered exceptional service to maritime education, the maritime industry, or the NMUAA.",
    benefits: ["Participate in events and network", "Exempt from annual dues", "Honorary recognition"],
    note: "Cannot vote or contest elections.",
    price: "Exempt",
    footnote: "Conferred by NGA resolution. Not open to application.",
    variant: "honorary",
  },
];

const MembershipCategoriesSection = () => {
  return (
    <section id="membership" className={`${shared.section} ${shared.paper}`} aria-labelledby="membership-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>04</b>Join the network</span>
          <div>
            <h2 id="membership-title" className={shared.title}>Membership categories</h2>
            <p className={shared.lede}>
              Membership is open to all NMU graduates, former staff, and distinguished individuals who share
              our commitment to maritime excellence.
            </p>
          </div>
        </header>

        <div className={styles.table}>
          {tiers.map((t) => (
            <article key={t.key} className={`${styles.tier} ${t.variant === "honorary" ? styles.honorary : ""}`}>
              <h3>{t.name}</h3>
              <p className={styles.who}>{t.who}</p>

              <div className={styles.price}>
                <span className={styles.priceLabel}>Annual dues</span>
                <strong>{t.price}</strong>
                {t.priceNote && <small>{t.priceNote}</small>}
              </div>

              <ul className={styles.benefits}>
                {t.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
              {t.note && <p className={styles.note}>{t.note}</p>}

              <div className={styles.action}>
                {t.cta ? (
                  <Link to="/register" className={styles.cta}>{t.cta}<span aria-hidden="true">→</span></Link>
                ) : (
                  <p className={styles.footnote}>{t.footnote}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipCategoriesSection;
