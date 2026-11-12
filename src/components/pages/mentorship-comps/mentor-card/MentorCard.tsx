import { Briefcase, GraduationCap } from "lucide-react";
import styles from "./MentorCard.module.css";
import type { MentorProfile } from "../../../../types";

interface Props {
  mentor: MentorProfile;
  alreadyRequested: boolean;
  onRequest: (mentor: MentorProfile) => void;
}

const MentorCard = ({ mentor, alreadyRequested, onRequest }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.photoWrap}>
        <img src={mentor.photo} alt={mentor.name} className={styles.photo} />
        {mentor.isMember && (
          <span className={styles.memberBadge}>Alumni Network Member</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{mentor.name}</h3>
        <p className={styles.role}>
          <Briefcase size={14} />{" "}
          {[mentor.role, mentor.company].filter(Boolean).join(", ")}
        </p>
        <p className={styles.discipline}>
          <GraduationCap size={14} /> {mentor.discipline}
          {mentor.graduationYear && <> · Class of {mentor.graduationYear}</>}
        </p>

        <p className={styles.bio}>{mentor.bio}</p>

        <div className={styles.tags}>
          {mentor.expertiseTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={styles.requestBtn}
          disabled={alreadyRequested}
          onClick={() => onRequest(mentor)}
        >
          {alreadyRequested ? "Request Sent" : "Request Mentorship"}
        </button>
      </div>
    </article>
  );
};

export default MentorCard;
