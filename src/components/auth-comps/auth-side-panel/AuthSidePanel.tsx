import { useEffect, useState } from "react";
import logo from "../../../assets/images/svg/nmulogo.png";
import styles from "./AuthSidePanel.module.css";
import { AUTH_CAROUSEL } from "./authCarouselData";

const ROTATE_MS = 3000;

const AuthSidePanel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % AUTH_CAROUSEL.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.panel}>
      {AUTH_CAROUSEL.map((slide, i) => (
        <div
          key={slide.image}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
          style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.position }}
        />
      ))}

      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.brand}>
          <img src={logo} alt="Nigeria Maritime University Alumni Association" className={styles.brandLogo} />
        </div>

        <div className={styles.textBlock}>
          {AUTH_CAROUSEL.map((slide, i) => (
            <div
              key={slide.title}
              className={`${styles.slideText} ${
                i === index ? styles.slideTextActive : ""
              }`}
            >
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {AUTH_CAROUSEL.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
