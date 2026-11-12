import shared from "../aboutShared.module.css";
import styles from "./AimsObjectivesSection.module.css";

const aims = [
  { title: "Unity & fellowship", description: "Promote unity, fellowship, professional development, and mutual welfare among all NMU alumni." },
  { title: "Global network", description: "Foster a vibrant network connecting members with NMU, government agencies, the maritime industry, and the international maritime community." },
  { title: "Academic support", description: "Actively support, advocate for, and contribute to the improvement of academic standards, facilities, and research at NMU." },
  { title: "Maritime advancement", description: "Advance the interests of Nigeria’s maritime sector in partnership with NIMASA, the Nigerian Ports Authority, the IMO, and all maritime stakeholders." },
  { title: "Heritage fund", description: "Establish and manage a Maritime Heritage and Development Fund for the benefit of members, the university, and the broader Nigerian maritime community." },
  { title: "Advocacy & policy", description: "Engage in advocacy, policy formulation, capacity building, and public interest activities consistent with the maritime vocation of members." },
  { title: "Scholarships & mentorship", description: "Establish scholarship programmes and mentorship schemes for current students of Nigeria Maritime University." },
  { title: "International standards", description: "Promote the values of the STCW Convention, MARPOL, MLC 2006, and allied IMO instruments in the conduct of members." },
];

const AimsObjectivesSection = () => {
  return (
    <section id="aims" className={shared.section} aria-labelledby="aims-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>03</b>What we stand for</span>
          <div>
            <h2 id="aims-title" className={shared.title}>Aims &amp; objectives</h2>
            <p className={shared.lede}>Eight commitments, set out in our constitution, that guide everything the association does.</p>
          </div>
        </header>

        <ol className={styles.list}>
          {aims.map((aim, i) => (
            <li key={aim.title}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{aim.title}</h3>
                <p>{aim.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AimsObjectivesSection;
