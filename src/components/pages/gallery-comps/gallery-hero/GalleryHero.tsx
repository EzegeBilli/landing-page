import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import portraitOne from "../../../../assets/images/gallery/gallery-hero-01-ai.png";
import portraitTwo from "../../../../assets/images/gallery/gallery-hero-02-ai.png";
import portraitThree from "../../../../assets/images/gallery/gallery-hero-03-ai.png";
import portraitFour from "../../../../assets/images/gallery/gallery-hero-04-ai.png";
import styles from "./GalleryHero.module.css";

// Use the four AI-enhanced versions selected for the header, in upload order.
const photos = [
  { id: "portrait-1", src: portraitOne, caption: "A cadet in service whites on the campus grounds", category: "Our community" },
  { id: "portrait-2", src: portraitTwo, caption: "A moment by the campus flagpoles", category: "Campus life" },
  { id: "portrait-3", src: portraitThree, caption: "Cadets gathered in ceremonial whites", category: "Shared moments" },
  { id: "portrait-4", src: portraitFour, caption: "Standing proud in maritime colours", category: "Our community" },
];
const INTERVAL = 3000;

export default function GalleryHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  // Reduced motion disables transitions in CSS while photographs still rotate.
  const playing = photos.length > 1 && !paused && visible;

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % photos.length), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  if (!photos.length) return null;
  const select = (index: number) => {
    setActive((index + photos.length) % photos.length);
  };

  return <section className={styles.carousel} aria-roledescription="carousel" aria-label="Gallery highlights">
    <div className={styles.topline}><span>NMU / THE PHOTO JOURNAL</span><span className={styles.live}><i aria-hidden="true" />Our people, our pride</span></div>
    <div className={styles.stack}>
      <div className={styles.stage}>
        {photos.map((photo, index) => <figure key={photo.id}
          className={`${styles.slide} ${active === index ? styles.active : ""}`}
          aria-hidden={active !== index} aria-label={`${index + 1} of ${photos.length}`} aria-roledescription="slide">
          <img src={photo.src} alt={photo.caption} fetchPriority={index === 0 ? "high" : "auto"} />
        </figure>)}
        <span className={styles.photoLabel}>{photos[active].category}</span>
        <div className={styles.caption} aria-live={playing ? "off" : "polite"}>
          <span>THE MOMENTS THAT CONNECT US</span>
          <p key={active}>{photos[active].caption}</p>
        </div>
      </div>
    </div>
    <div className={styles.bottomline}>
      <div className={styles.dots} aria-label="Choose a photograph">
        {photos.map((photo, index) => <button key={photo.id} type="button" onClick={() => select(index)} aria-label={`Show photo ${index + 1}`} aria-current={active === index ? "true" : undefined} className={active === index ? styles.currentDot : ""} />)}
      </div>
      {photos.length > 1 && <div className={styles.buttons}>
        <button type="button" onClick={() => select(active - 1)} aria-label="Previous photograph"><ArrowLeft size={16} /></button>
        <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
        <button type="button" onClick={() => select(active + 1)} aria-label="Next photograph"><ArrowRight size={16} /></button>
      </div>}
    </div>
  </section>;
}
