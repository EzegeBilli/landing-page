import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import layout from "../../styles/CommunityPages.module.css";
import styles from "./MemberDetailPage.module.css";
import { allMembers, getMemberById } from "../../mockdata/membersData";
import type { MemberProfile } from "../../types";

const MemberDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const member = getMemberById(id || "");
  const { prev, next, related } = useMemo(() => {
    if (!member) return { prev: null, next: null, related: [] };
    const index = allMembers.findIndex(item => item.id === member.id);
    return {
      prev: index > 0 ? allMembers[index - 1] : null,
      next: index < allMembers.length - 1 ? allMembers[index + 1] : null,
      related: allMembers.filter(item => item.category === member.category && item.id !== member.id).slice(0, 3),
    };
  }, [member]);

  if (!member) return <div className={`${layout.page} ${styles.notFound}`}>
    <span className={layout.eyebrow}>Alumni leadership</span>
    <h1>Member not found</h1>
    <p>The profile you are looking for does not exist or has been moved.</p>
    <Link to="/leadership" className={styles.primaryBtn}>&larr; Back to alumni leadership</Link>
  </div>;

  const categoryLabel = {
    executive: "National Executive Council", directors: "Director", trustees: "Board of Trustees", members: "Member",
  }[member.category];
  const hasTenure = !!member.tenure && member.tenure !== "\u2014";

  return <div className={layout.page}>
    <header className={`${layout.hero} ${styles.profileHero}`} aria-labelledby="profile-name">
      <div className={layout.heroGrid}>
        <div className={layout.heroInner}>
          <Link to="/leadership" className={styles.backLink}>&larr; Alumni leadership</Link>
          <span className={layout.eyebrow}>{categoryLabel}</span>
          <h1 id="profile-name">{member.name}</h1>
          <p className={styles.title}>{member.title}</p>
          <p className={styles.profession}>{member.profession}</p>
          <div className={layout.heroActions}>
            <a href="#profile-biography">Read full biography <span aria-hidden="true">&darr;</span></a>
            <Link to="/leadership">Meet the leadership</Link>
          </div>
        </div>
        <figure className={styles.portrait}>
          <img src={member.image} alt={member.name} fetchPriority="high" />
          <figcaption><span>Serving our alumni community</span><strong>{member.title}</strong></figcaption>
        </figure>
      </div>
    </header>

    <div className={styles.summaryWrap}>
      <dl className={styles.summary}>
        <div><dt>Leadership role</dt><dd>{member.title}</dd></div>
        <div><dt>Association</dt><dd>Nigeria Maritime University Alumni Association</dd></div>
        {hasTenure && <div><dt>Term of service</dt><dd>{member.tenure}</dd></div>}
      </dl>
    </div>

    <div className={styles.container}>
      <section id="profile-biography" className={styles.bioSection} aria-labelledby="biography-title">
        <div className={styles.bioIntro}>
          <span className={layout.eyebrow}>01 / Meet the person</span>
          <h2 id="biography-title">A life of service.<br /><em>A story to share.</em></h2>
          <p>{member.shortBio}</p>
        </div>
        <div className={styles.biography}>
          <h3>About {member.name}</h3>
          {member.fullBio.split("\n").filter(paragraph => paragraph.trim()).map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}
        </div>
      </section>
    </div>

    {related.length > 0 && <section className={styles.relatedSection} aria-labelledby="related-title">
      <div className={styles.container}>
        <span className={layout.eyebrow}>02 / Leading together</span>
        <div className={styles.relatedHeading}><h2 id="related-title">More from our {member.category === "executive" ? "Executive Council" : member.category === "directors" ? "directors" : member.category === "trustees" ? "Board of Trustees" : "community"}</h2><Link to="/leadership">View all members <span aria-hidden="true">&rarr;</span></Link></div>
        <div className={styles.relatedGrid}>{related.map(item => <RelatedCard key={item.id} member={item} />)}</div>
      </div>
    </section>}

    <div className={styles.container}>
      <nav className={styles.nav} aria-label="Member navigation">
        {prev ? <Link to={`/leadership/${prev.id}`} className={styles.navCard}>
          <span className={styles.navLabel}>&larr; Previous profile</span><span className={styles.navName}>{prev.name}</span>
        </Link> : <div />}
        {next ? <Link to={`/leadership/${next.id}`} className={`${styles.navCard} ${styles.navCardRight}`}>
          <span className={styles.navLabel}>Next profile &rarr;</span><span className={styles.navName}>{next.name}</span>
        </Link> : <div />}
      </nav>
    </div>
  </div>;
};

const RelatedCard = ({ member }: { member: MemberProfile }) => <Link to={`/leadership/${member.id}`} className={styles.relatedCard}>
  <div className={styles.relatedPhoto}><img src={member.image} alt={member.name} loading="lazy" /></div>
  <div className={styles.relatedInfo}><strong>{member.name}</strong><span>{member.title}</span><span className={styles.profileLink}>View profile <span aria-hidden="true">&rarr;</span></span></div>
</Link>;

export default MemberDetailPage;
