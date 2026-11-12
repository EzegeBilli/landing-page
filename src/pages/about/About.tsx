import AffiliationsSection from "../../components/pages/about-comps/affiliations-section/AffiliationsSection";
import AimsObjectivesSection from "../../components/pages/about-comps/aims-objectives-section/AimsObjectivesSection";
import ContactSection from "../../components/pages/about-comps/contact-section/ContactSection";
import GovernanceStructureSection from "../../components/pages/about-comps/governance-structure-section/GovernanceStructureSection";
import JoinNetworkSection from "../../components/pages/about-comps/join-network-section/JoinNetworkSection";
import MembershipCategoriesSection from "../../components/pages/about-comps/membership-categories-section/MembershipCategoriesSection";
import OurStorySection from "../../components/pages/about-comps/our-story-section/OurStorySection";
import WhoWeAreSection from "../../components/pages/about-comps/who-we-are-section/WhoWeAreSection";
import { Link } from "react-router-dom";
import campusImage from "../../assets/images/png/campus-aerial.png";
import styles from "./About.module.css";

const facts = [
  { value: "2018", label: "Nigeria Maritime University founded in Okerenkoko" },
  { value: "1st", label: "Maritime university in Nigeria and West Africa" },
  { value: "6", label: "Governing organs under the NMUAA Constitution" },
  { value: "3", label: "Membership categories open to our community" },
];

const contents = [
  ["01", "Who we are", "#who-we-are"],
  ["02", "Our story", "#our-story"],
  ["03", "Aims", "#aims"],
  ["04", "Membership", "#membership"],
  ["05", "Governance", "#governance"],
  ["06", "Affiliations", "#affiliations"],
  ["07", "Contact", "#contact"],
];

const About = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroGrid}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>About the association</span>
            <h1 id="about-title">Our shared roots.<br /><em>An open horizon.</em></h1>
            <p>We are the graduates of Nigeria Maritime University, supporting one another, giving back to our university, and contributing to Nigeria’s maritime future.</p>
            <div className={styles.heroActions}>
              <a href="#who-we-are" className={styles.heroPrimary}>Get to know us <span aria-hidden="true">↓</span></a>
              <Link to="/register" className={styles.heroSecondary}>Become a member</Link>
            </div>
          </div>
          <figure className={styles.heroPhoto}>
            <img src={campusImage} alt="Nigeria Maritime University campus seen from above, with students assembled on the parade ground" fetchPriority="high" />
            <figcaption>Nigeria Maritime University campus</figcaption>
          </figure>
        </div>
      </section>

      <div className={styles.factsWrap}>
        <dl className={styles.facts}>
          {facts.map((f) => (
            <div key={f.value}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <nav className={styles.contents} aria-label="On this page">
        <ol>
          {contents.map(([n, label, href]) => (
            <li key={href}><a href={href}><span>{n}</span>{label}</a></li>
          ))}
        </ol>
      </nav>

      <WhoWeAreSection />
      <OurStorySection />
      <AimsObjectivesSection />
      <MembershipCategoriesSection />
      <GovernanceStructureSection />
      <AffiliationsSection />
      <ContactSection />
      <JoinNetworkSection />
    </div>
  );
};

export default About;
