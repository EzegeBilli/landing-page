import shared from "../aboutShared.module.css";
import styles from "./OurStorySection.module.css";
import graduatesImage from "../../../../assets/images/png/about-img.png";

const milestones = [
  { mark: "2018", text: "Nigeria Maritime University is established in Okerenkoko, Delta State, as West Africa’s first university dedicated solely to maritime education." },
  { mark: "Pioneers", text: "The first cohorts graduate, and the need for a structured alumni network becomes clear." },
  { mark: "NMUAA", text: "The association is formed to connect graduates with each other, the university, industry and the international maritime community." },
  { mark: "Ahead", text: "Everything we build, we build for those who come after us." },
];

const OurStorySection = () => {
  return (
    <section id="our-story" className={`${shared.section} ${shared.paper}`} aria-labelledby="our-story-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>02</b>Our history</span>
          <div>
            <h2 id="our-story-title" className={shared.title}>Our story</h2>
            <p className={shared.lede}>
              NMU was born from the recognition that Africa’s largest economy needed a world-class
              institution to produce the maritime professionals who would drive its blue economy.
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <figure className={styles.photo}>
            <img src={graduatesImage} alt="NMU graduates in navy and lime convocation gowns seated at a ceremony" loading="lazy" />
            <figcaption>NMU graduates at convocation</figcaption>
          </figure>

          <ol className={styles.timeline}>
            {milestones.map((m) => (
              <li key={m.mark}>
                <span className={styles.mark}>{m.mark}</span>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <blockquote className={styles.quote}>
          <p>“We are the graduates of the first maritime university in Nigeria and West Africa. Our legacy is not just behind us. It is ahead of us.”</p>
        </blockquote>
      </div>
    </section>
  );
};

export default OurStorySection;
