import layout from "../../styles/CommunityPages.module.css";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import styles from "./News.module.css";
import NewsCard from "../../components/pages/news-comps/news-card/NewsCard";
import { NEWS } from "../../components/pages/news-comps/news-list/newsData";
import type { NewsCategory } from "../../types";

type CategoryFilter = "all" | NewsCategory;

const CATEGORIES: CategoryFilter[] = [
  "all",
  "News",
  "Blog",
  "Achievement",
  "Announcement",
  "Career",
];

const News = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = NEWS.find((a) => a.featured);


  const filtered = useMemo(() => {
    let list = NEWS;

    if (category !== "all") {
      list = list.filter((a) => a.category === category);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }

    return list;
  }, [search, category]);

  return (
    <div className={layout.page}>
      <section className={layout.hero} aria-labelledby="news-title">
        <div className={layout.heroGrid}>
          <div className={layout.heroInner}>
            <span className={layout.eyebrow}>News &amp; Blog</span>
            <h1 id="news-title">Our community.<br /><em>Our stories.</em></h1>
            <p>Stories, updates and career milestones from the Nigeria Maritime University Alumni Network.</p>
            <div className={layout.heroActions}><a href="#news-stories">Explore stories <span aria-hidden="true">&darr;</span></a><Link to="/gallery">View our gallery</Link></div>
          </div>
          {featured && <article className={styles.heroFeature}>
            <Link to={`/news/${featured.id}`} className={styles.featureImageLink} tabIndex={-1} aria-hidden="true"><img src={featured.image} alt="" fetchPriority="high" /></Link>
            <div className={styles.featuredContent}>
              <span className={styles.featuredBadge}>In focus / {featured.category}</span>
              <h2><Link to={`/news/${featured.id}`}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p>
              <div className={styles.featuredMeta}><span>{featured.author}</span><span>{featured.date}</span><span>{featured.readTime}</span></div>
            </div>
          </article>}
        </div>
      </section>

      <div className={layout.sectionIntro} id="news-stories">
        <span className={layout.eyebrow}>01 / From the network</span>
        <h2>Stories worth sharing</h2>
        <p>Discover the latest news, alumni achievements and perspectives from our community.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="search"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search news and blog articles"
            />
          </div>

          <div className={styles.tabs} role="group" aria-label="Filter articles by category">
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
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No articles match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
