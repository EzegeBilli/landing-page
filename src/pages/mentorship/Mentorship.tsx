import { useEffect, useMemo, useRef, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import styles from "./Mentorship.module.css";
import MentorCard from "../../components/pages/mentorship-comps/mentor-card/MentorCard";
import { useAuth } from "../../context/auth/useAuth";
import { DISCIPLINES } from "../../constants/Disciplines";
import { toast } from "../../components/toast/toast";
import { ApiError } from "../../api/client";
import {
  getSentRequests,
  listMentors,
  mentorshipKeys,
  OPEN_STATUSES,
  retryUnlessClientError,
  sendMentorshipRequest,
  type ApiMentor,
  type MentorFilters,
} from "../../api/mentorship";
import type { MentorProfile } from "../../types";

type DisciplineFilter = "all" | (typeof DISCIPLINES)[number];

const PAGE_SIZE = 12;
const MAX_MESSAGE_LENGTH = 1000;

const apiToMentor = (mentor: ApiMentor): MentorProfile => ({
  id: mentor.id,
  name: mentor.fullName,
  photo:
    mentor.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      mentor.fullName
    )}&background=0A2540&color=fff&size=300&bold=true`,
  discipline: mentor.department || mentor.discipline || "NMU Alumni",
  role: mentor.currentRole || "Alumnus",
  company: mentor.company || "",
  graduationYear: mentor.graduationYear ? String(mentor.graduationYear) : "",
  yearsExperience: "",
  expertiseTags: mentor.mentorExpertise.length
    ? mentor.mentorExpertise
    : mentor.department ? [mentor.department] : [],
  bio: mentor.bio || "A registered member of the NMU Alumni Network.",
  isMember: true,
});

const Mentorship = () => {
  const { user, isAuthenticated, isDemo } = useAuth();
  const navigate = useNavigate();

  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [activeMentor, setActiveMentor] = useState<MentorProfile | null>(null);
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  // Mentors the backend reported a duplicate open request for (409).
  const [conflictIds, setConflictIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Debounce the name search so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const filters: MentorFilters = {
    department: discipline === "all" ? undefined : discipline,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  };
  const mentors = useQuery({
    queryKey: mentorshipKeys.mentors(filters),
    queryFn: () => listMentors(filters),
    placeholderData: keepPreviousData,
    retry: retryUnlessClientError,
  });

  // Mentors with an open request from this user show "Request Sent".
  // Non-blocking: if this fails, the backend still rejects duplicates with 409.
  const canRequest = isAuthenticated && !isDemo && !!user;
  const sent = useQuery({
    queryKey: mentorshipKeys.sent(user?.id ?? ""),
    queryFn: getSentRequests,
    enabled: canRequest,
    retry: retryUnlessClientError,
  });
  const requestedIds = useMemo(() => new Set([
    ...(sent.data ?? [])
      .filter((r) => r.mentorId && OPEN_STATUSES.includes(r.status))
      .map((r) => r.mentorId as string),
    ...conflictIds,
  ]), [sent.data, conflictIds]);

  const visibleMentors = useMemo(
    () => (mentors.data?.items ?? []).map(apiToMentor).filter((m) => m.id !== user?.id),
    [mentors.data, user?.id]
  );

  const sendRequest = useMutation({
    mutationFn: sendMentorshipRequest,
    retry: false,
  });

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
  }, []);

  const selectDiscipline = (value: DisciplineFilter) => {
    setDiscipline(value);
    setPage(1);
  };

  const handleRequestClick = (mentor: MentorProfile) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/mentorship" } });
      return;
    }
    if (isDemo) {
      toast.error("Mentorship requests need a registered account. The demo account can't send them.");
      return;
    }
    setMessage("");
    setSendError("");
    setActiveMentor(mentor);
  };

  const sending = sendRequest.isPending;

  const closeModal = () => {
    if (sending) return;
    setActiveMentor(null);
  };

  const handleSubmitRequest = () => {
    if (!activeMentor || !user || sending) return;
    const text = message.trim();
    if (!text) return;

    const mentor = activeMentor;
    setSendError("");
    sendRequest.mutate({ mentorId: mentor.id, message: text }, {
      onSuccess: () => {
        setActiveMentor(null);
        toast.success(`Request sent to ${mentor.name}.`);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          // Already an open request with this mentor: reflect that on the card.
          setConflictIds((prev) => [...prev, mentor.id]);
        }
        setSendError(error instanceof Error ? error.message : "Could not send your request. Please try again.");
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: mentorshipKeys.sent(user.id) }),
    });
  };

  const pagination = mentors.data?.pagination ?? null;

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
                onClick={() => selectDiscipline("all")}
              >
                All Disciplines
                {discipline === "all" && pagination && !search && (
                  <span className={styles.count}>{pagination.total}</span>
                )}
              </button>
              {DISCIPLINES.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.tab} ${
                    discipline === d ? styles.tabActive : ""
                  }`}
                  onClick={() => selectDiscipline(d)}
                >
                  {d}
                  {discipline === d && pagination && !search && (
                    <span className={styles.count}>{pagination.total}</span>
                  )}
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
          <label className={styles.searchBox}>
            <Search size={16} aria-hidden="true" />
            <span className={styles.srOnly}>Search mentors by name</span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search mentors by name"
            />
          </label>

          {mentors.isPending && (
            <div className={styles.empty} role="status">
              <p>Loading mentors…</p>
            </div>
          )}

          {mentors.isError && (
            <div className={styles.empty} role="alert">
              <p>{mentors.error instanceof Error ? mentors.error.message : "Could not load mentors."}</p>
              <button type="button" className={styles.retryBtn} onClick={() => void mentors.refetch()}>
                Try again
              </button>
            </div>
          )}

          {mentors.isSuccess && (visibleMentors.length === 0 ? (
            <div className={styles.empty}>
              <p>
                {search || discipline !== "all"
                  ? "No mentors match your filters yet."
                  : "No mentors are available yet. Check back soon."}
              </p>
            </div>
          ) : (
            <div className={styles.grid} aria-busy={mentors.isPlaceholderData}>
              {visibleMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  alreadyRequested={canRequest && requestedIds.has(mentor.id)}
                  onRequest={handleRequestClick}
                />
              ))}
            </div>
          ))}

          {pagination && pagination.pages > 1 && (
            <nav className={styles.pager} aria-label="Mentor pages">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      </section>

      {activeMentor && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              disabled={sending}
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
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm a cadet studying... I'd love guidance on..."
              className={styles.modalTextarea}
            />
            <p className={styles.charCount}>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>

            {sendError && (
              <p className={styles.modalError} role="alert">{sendError}</p>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={closeModal}
                disabled={sending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSubmitRequest}
                disabled={!message.trim() || sending}
              >
                {sending ? "Sending…" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
