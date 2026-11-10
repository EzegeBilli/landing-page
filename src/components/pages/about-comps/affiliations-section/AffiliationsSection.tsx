import { useState } from "react";
import shared from "../aboutShared.module.css";
import styles from "./AffiliationsSection.module.css";
import nimasaLogo from "../../../../assets/images/logos/nimasa.jpg";
import imoLogo from "../../../../assets/images/logos/imo.png";
import cacLogo from "../../../../assets/images/logos/cac.png";
import nperaLogo from "../../../../assets/images/logos/npera.png";

type Affiliation = {
  title: string;
  description: string;
  /** Official logo. Without one, the acronym is set as a wordmark. */
  logo?: string;
  /** "wide" logos (horizontal lockups) get more width, less height. */
  shape?: "wide";
};

// To add a logo (e.g. NPA, NMU): drop the file in src/assets/images/logos and set `logo` here.
const affiliations: Affiliation[] = [
  { title: "NMU", description: "Nigeria Maritime University" },
  { title: "NIMASA", description: "Nigerian Maritime Administration and Safety Agency", logo: nimasaLogo },
  { title: "NPA", description: "Nigerian Ports Authority" },
  { title: "NPERA", description: "Nigeria Ports Economic Regulatory Agency (formerly Nigerian Shippers’ Council)", logo: nperaLogo },
  { title: "IMO", description: "International Maritime Organization", logo: imoLogo, shape: "wide" },
  { title: "STCW", description: "Standards of Training, Certification & Watchkeeping" },
  { title: "CAC", description: "Corporate Affairs Commission", logo: cacLogo, shape: "wide" },
];

const Card = ({ item }: { item: Affiliation }) => (
  <figure className={styles.card}>
    <div className={styles.logoBox}>
      {item.logo ? (
        <img src={item.logo} alt={`${item.title} logo`} className={item.shape === "wide" ? styles.wide : undefined} loading="lazy" />
      ) : (
        <span className={styles.wordmark}>{item.title}</span>
      )}
    </div>
    <figcaption>
      <strong>{item.title}</strong>
      <span>{item.description}</span>
    </figcaption>
  </figure>
);

const AffiliationsSection = () => {
  const [paused, setPaused] = useState(false);

  return (
    <section id="affiliations" className={`${shared.section} ${shared.paper}`} aria-labelledby="affiliations-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>06</b>Our affiliations</span>
          <div>
            <h2 id="affiliations-title" className={shared.title}>Industry partners &amp; regulatory bodies</h2>
            <p className={shared.lede}>The institutions and standards that shape our university and the maritime sector our alumni serve.</p>
          </div>
        </header>
      </div>

      <div className={`${styles.viewport} ${paused ? styles.paused : ""}`}>
        <ul className={styles.track} aria-label="Affiliated institutions">
          {affiliations.map((item) => <li key={item.title}><Card item={item} /></li>)}
          {/* second copy makes the loop seamless; hidden from assistive tech */}
          {affiliations.map((item) => <li key={`${item.title}-dup`} aria-hidden="true" className={styles.dup}><Card item={item} /></li>)}
        </ul>
      </div>

      <div className={shared.inner}>
        <div className={styles.controls}>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            {paused ? "Play" : "Pause"}
          </button>
          <span>{affiliations.length} institutions and standards</span>
        </div>
      </div>
    </section>
  );
};

export default AffiliationsSection;
