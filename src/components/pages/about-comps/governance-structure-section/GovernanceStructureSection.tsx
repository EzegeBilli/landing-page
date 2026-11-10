import { Link } from "react-router-dom";
import shared from "../aboutShared.module.css";
import styles from "./GovernanceStructureSection.module.css";

type Organ = { role: string; title: string; short: string; description: string };

const assembly: Organ = {
  role: "Supreme legislative organ",
  title: "National General Assembly",
  short: "NGA",
  description: "The highest decision-making body of the association. Consists of all full members in good standing.",
};

const organs: Organ[] = [
  { role: "Fiduciary", title: "Board of Trustees", short: "BOT", description: "Holds the association’s assets in trust and ensures constitutional compliance." },
  { role: "Executive", title: "National Executive Council", short: "NEC", description: "18 elected officers who run the day-to-day operations of the association." },
  { role: "Electoral", title: "National Alumni Electoral Commission", short: "NALECO", description: "An independent organ that conducts all elections of the association." },
  { role: "Judicial", title: "Ethics & Disciplinary Tribunal", short: "EDT", description: "Hears and decides all disciplinary matters brought before it." },
];

const chapters: Organ = {
  role: "Sub-national",
  title: "Chapters",
  short: "",
  description: "Operating in states across Nigeria and internationally for diaspora members.",
};

const Node = ({ organ, tone }: { organ: Organ; tone?: "dark" }) => (
  <div className={`${styles.node} ${tone === "dark" ? styles.dark : ""}`}>
    <span className={styles.role}>{organ.role}</span>
    <h3>
      {organ.title}
      {organ.short && <abbr title={organ.title}>{organ.short}</abbr>}
    </h3>
    <p>{organ.description}</p>
  </div>
);

const GovernanceStructureSection = () => {
  return (
    <section id="governance" className={shared.section} aria-labelledby="governance-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>05</b>How we’re governed</span>
          <div>
            <h2 id="governance-title" className={shared.title}>Governance structure</h2>
            <p className={shared.lede}>
              NMUAA is governed through six organs, each with a clear and non-overlapping mandate defined in
              the NMUAA Constitution.
            </p>
          </div>
        </header>

        <div className={styles.chart} role="list" aria-label="Organs of the association">
          <div className={styles.top} role="listitem"><Node organ={assembly} tone="dark" /></div>
          <div className={styles.tier} role="listitem">
            <ul>
              {organs.map((o) => <li key={o.short}><Node organ={o} /></li>)}
            </ul>
          </div>
          <div className={styles.base} role="listitem"><Node organ={chapters} /></div>
        </div>

        <p className={styles.footer}>
          For current office holders, see the <Link to="/leadership">Leadership page <span aria-hidden="true">→</span></Link>
        </p>
      </div>
    </section>
  );
};

export default GovernanceStructureSection;
