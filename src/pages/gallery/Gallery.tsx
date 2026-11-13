import layout from "../../styles/CommunityPages.module.css";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Gallery.module.css";
import GalleryGrid from "../../components/pages/gallery-comps/gallery-grid/GalleryGrid";
import GalleryHero from "../../components/pages/gallery-comps/gallery-hero/GalleryHero";
import { GALLERY } from "../../components/pages/gallery-comps/gallery-grid/galleryData";
import type { GalleryCategory } from "../../types";

type CategoryFilter = "all" | GalleryCategory;

const CATEGORIES: CategoryFilter[] = [
  "all",
  "Events",
  "Graduation",
  "Campus Life",
  "Reunions",
  "Sports",
];

const Gallery = () => {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    if (category === "all") return GALLERY;
    return GALLERY.filter((img) => img.category === category);
  }, [category]);

  const counts = useMemo(() => {
    const map: Record<CategoryFilter, number> = {
      all: GALLERY.length,
      Events: 0,
      Graduation: 0,
      "Campus Life": 0,
      Reunions: 0,
      Sports: 0,
    };
    GALLERY.forEach((img) => {
      map[img.category] += 1;
    });
    return map;
  }, []);

  return (
    <div className={layout.page}>
      <section className={layout.hero} aria-labelledby="gallery-title">
        <div className={layout.heroGrid}>
          <div className={layout.heroInner}>
            <span className={layout.eyebrow}>Photo gallery</span>
            <h1 id="gallery-title">Shared experiences.<br /><em>Lasting memories.</em></h1>
            <p>Moments from campus life, graduations, reunions and events across the NMU Alumni Network.</p>
            <div className={layout.heroActions}><a href="#gallery-collection">Explore the gallery <span aria-hidden="true">&darr;</span></a><Link to="/events">Discover events</Link></div>
          </div>
          <GalleryHero />
        </div>
      </section>

      <div className={layout.sectionIntro} id="gallery-collection">
        <span className={layout.eyebrow}>01 / In pictures</span>
        <h2>A community to remember</h2>
        <p>Browse our collection. Select a photograph to take a closer look.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          {CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              className={`${styles.tab} ${
                category === key ? styles.tabActive : ""
              }`}
              onClick={() => setCategory(key)}
            >
              {key === "all" ? "All" : key}
              <span className={styles.count}>{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <GalleryGrid images={filtered} />
        </div>
      </section>
    </div>
  );
};

export default Gallery;
