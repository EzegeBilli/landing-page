import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import styles from "./Mentorship.module.css";
import MentorCard from "../../components/pages/mentorship-comps/mentor-card/MentorCard";
import { MENTORS } from "../../components/pages/mentorship-comps/mentor-list/mentorsData";
import {
  addMentorRequest,
  hasPendingRequest,
} from "../../components/pages/mentorship-comps/mentor-list/mentorRequestsStore";
import { useAuth } from "../../context/auth/useAuth";
import { DISCIPLINES } from "../../constants/Disciplines";
import type { MentorProfile, PublicProfile } from "../../types";

type DisciplineFilter = "all" | (typeof DISCIPLINES)[number];

const memberToMentor = (member: PublicProfile): MentorProfile => ({
  id: member.id,
  name: member.fullName,
  photo:
    member.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      member.fullName
    )}&background=0A2540&color=fff&size=300&bold=true`,
  discipline: member.discipline,
  role: member.currentRole || member.memberType,
  company: member.company || "NMU Alumni Network",
  graduationYear: member.graduationYear,
  yearsExperience: "Member",
  expertiseTags: member.mentorExpertise?.length
    ? member.mentorExpertise
    : [member.discipline],
  bio: member.bio || "A registered member of the NMU Alumni Network.",
  email: member.email,
  isMember: true,
});

const Mentorship = () => {
  const { user, isAuthenticated, getMentorUsers } = useAuth();
  const navigate = useNavigate();

  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [activeMentor, setActiveMentor] = useState<MentorProfile | null>(null);
  const [message, setMessage] = useState("");
  const [sentIds, setSentIds] = useState<string[]>([]);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allMentors = useMemo(() => {
    const memberMentors = getMentorUsers()
      .filter((m) => m.id !== user?.id)
      .map(memberToMentor);
    return [...memberMentors, ...MENTORS];
  }, [getMentorUsers, user?.id]);

  const filtered = useMemo(() => {
    if (discipline === "all") return allMentors;
    return allMentors.filter((m) => m.discipline === discipline);
  }, [allMentors, discipline]);

  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allMentors.length };
    DISCIPLINES.forEach((d) => {
      counts[d] = allMentors.filter((m) => m.discipline === d).length;
    });
    return counts;
  }, [allMentors]);

  const updateScrollFades = () => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollTabsBy = (amount: number) => {
    tabsRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollFades();
    window.addEventListener("resize", updateScrollFades);
    return () => window.removeEventListener("resize", updateScrollFades);
  }, [allMentors]);

  const handleRequestClick = (mentor: MentorProfile) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/mentorship" } });
      return;
    }
    setMessage("");
    setActiveMentor(mentor);
  };

  const handleSubmitRequest = () => {
    if (!activeMentor || !user) return;

    addMentorRequest({
      mentorId: activeMentor.id,
      mentorName: activeMentor.name,
      mentorEmail: activeMentor.email,
      requesterId: user.id,
      requesterName: user.fullName,
      requesterEmail: user.email,
      message: message.trim(),
    });

    setSentIds((prev) => [...prev, activeMentor.id]);
    setActiveMentor(null);
  };

  const isRequested = (mentorId: string) =>
    sentIds.includes(mentorId) ||
    (!!user && hasPendingRequest(mentorId, user.id));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Find a Mentor</h1>
          <p>
            Connect one-on-one with alumni who've walked the path before you —
            from the bridge to the boardroom.
          </p>
        </div>
      </section>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <span className={styles.filterLabel}>
            <Filter size={15} />
            <span className={styles.filterLabelText}>Filter</span>
          </span>

          <div className={styles.tabsScroll}>
            {canScrollLeft && (
              <button
                type="button"
                className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`}
                onClick={() => scrollTabsBy(-220)}
                aria-label="Scroll filters left"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <div
              className={styles.tabsRow}
              ref={tabsRef}
              onScroll={updateScrollFades}
            >
              <button
                type="button"
                className={`${styles.tab} ${
                  discipline === "all" ? styles.tabActive : ""
                }`}
                onClick={() => setDiscipline("all")}
              >
                All Disciplines
                <span className={styles.count}>{disciplineCounts.all}</span>
              </button>
              {DISCIPLINES.filter((d) => disciplineCounts[d] > 0 || d === discipline).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.tab} ${
                    discipline === d ? styles.tabActive : ""
                  }`}
                  onClick={() => setDiscipline(d)}
                >
                  {d}
                  <span className={styles.count}>{disciplineCounts[d]}</span>
                </button>
              ))}
            </div>
            {canScrollRight && (
              <button
                type="button"
                className={`${styles.scrollBtn} ${styles.scrollBtnRight}`}
                onClick={() => scrollTabsBy(220)}
                aria-label="Scroll filters right"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isAuthenticated && !user?.isMentor && (
        <div className={styles.becomeMentorBanner}>
          <p>Want to guide the next generation of NMU graduates?</p>
          <Link to="/profile" className={styles.becomeMentorLink}>
            Become a mentor from your profile →
          </Link>
        </div>
      )}

      <section className={styles.section}>
        <div className={styles.container}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No mentors found in this discipline yet.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  alreadyRequested={isRequested(mentor.id)}
                  onRequest={handleRequestClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {activeMentor && (
        <div className={styles.modalOverlay} onClick={() => setActiveMentor(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setActiveMentor(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2>Request Mentorship</h2>
            <p className={styles.modalSubtitle}>
              Send a short message to <strong>{activeMentor.name}</strong>{" "}
              explaining what you'd like guidance on.
            </p>

            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm a cadet studying... I'd love guidance on..."
              className={styles.modalTextarea}
            />

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setActiveMentor(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSubmitRequest}
                disabled={!message.trim()}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
