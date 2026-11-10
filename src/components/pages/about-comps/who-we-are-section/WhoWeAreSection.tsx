import shared from "../aboutShared.module.css";
import styles from "./WhoWeAreSection.module.css";

const factSheet = [
  { term: "Full name", value: "Nigeria Maritime University Alumni Association" },
  { term: "Legal status", value: "Incorporated Trustees, Part F, CAMA 2020" },
  { term: "Character", value: "Non-partisan, non-sectarian, non-profit" },
  { term: "Headquarters", value: "Delta State, Nigeria" },
  { term: "Motto", value: "“Charting the Future, Upholding Our Legacy”" },
];

const colours = [
  { name: "Navy Blue", className: styles.navy },
  { name: "Gold", className: styles.gold },
  { name: "White", className: styles.white },
];

const WhoWeAreSection = () => {
  return (
    <section id="who-we-are" className={shared.section} aria-labelledby="who-we-are-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>01</b>Our identity</span>
          <h2 id="who-we-are-title" className={shared.title}>Who we are</h2>
        </header>

        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.lead}>
              The Nigeria Maritime University Alumni Association (NMUAA) is the official alumni body of
              Nigeria Maritime University, Okerenkoko, the first dedicated maritime university in Nigeria
              and West Africa.
            </p>
            <p>
              We are a body of Incorporated Trustees, registered under Part F of the Companies and Allied
              Matters Act, 2020 (CAMA), operating as a non-partisan, non-sectarian, non-profit organisation
              under the laws of the Federal Republic of Nigeria.
            </p>
            <p>
              Our membership spans graduates across all faculties of NMU, from Marine Engineering and Naval
              Architecture to Maritime Law, Environmental Science, and Transport &amp; Logistics. We also
              welcome former academic and administrative staff as Associate Members, and honour
              distinguished individuals with Honorary Membership on the recommendation of the National
              General Assembly.
            </p>
          </div>

          <aside className={styles.sheet} aria-label="Association at a glance">
            <div className={styles.sheetHead}>
              <span>NMUAA</span>
              <small>At a glance</small>
            </div>
            <dl>
              {factSheet.map((row) => (
                <div key={row.term} className={styles.row}>
                  <dt>{row.term}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
              <div className={styles.row}>
                <dt>Official colours</dt>
                <dd className={styles.colours}>
                  {colours.map((c) => (
                    <span key={c.name}><i className={c.className} aria-hidden="true" />{c.name}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
