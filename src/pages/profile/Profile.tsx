import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Camera,
  Check,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Users,
  X,
} from "lucide-react";
import styles from "./Profile.module.css";
import { useAuth } from "../../context/auth/useAuth";
import { DISCIPLINES, DISCIPLINE_GROUPS, GRADUATION_YEARS } from "../../constants/Disciplines";
import {
  getRequestsForMentor,
  getRequestsForUser,
  updateRequestStatus,
} from "../../components/pages/mentorship-comps/mentor-list/mentorRequestsStore";
import { MENTORS } from "../../components/pages/mentorship-comps/mentor-list/mentorsData";
import { resizeImageFile } from "../../utils/resizeImage";
import DemoMembership from "./DemoMembership";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState("");

  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || "",
    discipline: user?.discipline || DISCIPLINES[0],
    graduationYear: user?.graduationYear || GRADUATION_YEARS[0],
    currentRole: user?.currentRole || "",
    company: user?.company || "",
    location: user?.location || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  }));

  const [mentorEditing, setMentorEditing] = useState(false);
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
  const [expertiseInput, setExpertiseInput] = useState(
    user?.mentorExpertise?.join(", ") || ""
  );
  const [myRequests] = useState(() =>
    user ? getRequestsForUser(user.id) : []
  );
  const [receivedRequests, setReceivedRequests] = useState(() =>
    user?.isMentor ? getRequestsForMentor(user.id) : []
  );

  if (!user) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }

    try {
      const dataUrl = await resizeImageFile(file);
      updateProfile({ avatar: dataUrl });
      setAvatarError("");
    } catch {
      setAvatarError("Couldn't load that image. Try another one.");
    }

    e.target.value = "";
  };

  const handleSaveMentorSettings = () => {
    const mentorExpertise = expertiseInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updateProfile({ isMentor, mentorExpertise });
    setMentorEditing(false);
  };

  const handleRequestAction = (
    requestId: string,
    status: "Accepted" | "Declined"
  ) => {
    updateRequestStatus(requestId, status);
    setReceivedRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.avatarWrap}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar}>{initials(user.fullName)}</div>
            )}
            <button
              type="button"
              className={styles.avatarEditBtn}
              onClick={handleAvatarClick}
              aria-label="Change profile picture"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h1>{user.fullName}</h1>
            <p className={styles.badgeRow}>
              <span className={styles.badge}>{user.memberType}</span>
              {user.isMentor && (
                <span className={styles.mentorBadge}>Mentor</span>
              )}
              <span>
                {user.discipline} · Class of {user.graduationYear}
              </span>
            </p>
            {avatarError && (
              <p className={styles.avatarError}>{avatarError}</p>
            )}
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Profile card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>My Profile</h2>
              {!editing && (
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={14} /> Edit
                </button>
              )}
            </div>

            {!editing ? (
              <div className={styles.details}>
                <p>
                  <Mail size={16} /> {user.email}
                </p>
                {user.currentRole && (
                  <p>
                    <Briefcase size={16} /> {user.currentRole}
                  </p>
                )}
                {user.company && (
                  <p>
                    <Building2 size={16} /> {user.company}
                  </p>
                )}
                {user.location && (
                  <p>
                    <MapPin size={16} /> {user.location}
                  </p>
                )}
                {user.phone && (
                  <p>
                    <Phone size={16} /> {user.phone}
                  </p>
                )}
                <p className={styles.bio}>
                  {user.bio || "No bio added yet. Click Edit to introduce yourself."}
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="discipline">Discipline</label>
                    <select
                      id="discipline"
                      value={form.discipline}
                      onChange={(e) =>
                        setForm({ ...form, discipline: e.target.value })
                      }
                    >
                      {DISCIPLINE_GROUPS.map((g) => (
                        <optgroup key={g.faculty} label={g.faculty}>
                          {g.programmes.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="graduationYear">Graduation Year</label>
                    <select
                      id="graduationYear"
                      value={form.graduationYear}
                      onChange={(e) =>
                        setForm({ ...form, graduationYear: e.target.value })
                      }
                    >
                      {GRADUATION_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="currentRole">Current Role</label>
                    <input
                      id="currentRole"
                      value={form.currentRole}
                      onChange={(e) =>
                        setForm({ ...form, currentRole: e.target.value })
                      }
                      placeholder="e.g. Chief Engineer"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="e.g. NLNG"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="e.g. Lagos, Nigeria"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell fellow alumni about yourself…"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Mentor settings */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Mentor Settings</h2>
                {!mentorEditing && (
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => setMentorEditing(true)}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>

              {!mentorEditing ? (
                <div className={styles.details}>
                  <p className={styles.mentorStatus}>
                    {user.isMentor
                      ? "You're listed as a mentor. Alumni and cadets can request guidance from you."
                      : "You're not listed as a mentor yet."}
                  </p>
                  {user.isMentor && user.mentorExpertise && (
                    <div className={styles.tags}>
                      {user.mentorExpertise.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.form}>
                  <label className={styles.toggleRow}>
                    <input
                      type="checkbox"
                      checked={isMentor}
                      onChange={(e) => setIsMentor(e.target.checked)}
                    />
                    Available as a mentor
                  </label>

                  {isMentor && (
                    <div className={styles.field}>
                      <label htmlFor="expertise">
                        Areas of expertise (comma-separated)
                      </label>
                      <input
                        id="expertise"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        placeholder="e.g. Watchkeeping, Port Operations"
                      />
                    </div>
                  )}

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setMentorEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveMentorSettings}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Requests received (as a mentor) */}
            {user.isMentor && (
              <div className={styles.card}>
                <h2>Mentorship Requests Received</h2>
                {receivedRequests.length === 0 ? (
                  <p className={styles.empty}>No requests yet.</p>
                ) : (
                  <ul className={styles.receivedList}>
                    {receivedRequests.map((r) => (
                      <li key={r.id}>
                        <div className={styles.receivedHeader}>
                          <strong>{r.requesterName}</strong>
                          <span
                            className={`${styles.status} ${
                              styles[r.status.toLowerCase()]
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className={styles.receivedMessage}>{r.message}</p>

                        {r.status === "Pending" ? (
                          <div className={styles.receivedActions}>
                            <button
                              type="button"
                              className={styles.acceptBtn}
                              onClick={() =>
                                handleRequestAction(r.id, "Accepted")
                              }
                            >
                              <Check size={13} /> Accept
                            </button>
                            <button
                              type="button"
                              className={styles.declineBtn}
                              onClick={() =>
                                handleRequestAction(r.id, "Declined")
                              }
                            >
                              <X size={13} /> Decline
                            </button>
                          </div>
                        ) : r.status === "Accepted" ? (
                          <a
                            href={`mailto:${r.requesterEmail}`}
                            className={styles.contactLink}
                          >
                            <Mail size={13} /> {r.requesterEmail}
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Requests I've sent */}
            <div className={styles.card}>
              <h2>My Mentorship Requests</h2>
              {myRequests.length === 0 ? (
                <p className={styles.empty}>
                  You haven't requested a mentor yet.
                </p>
              ) : (
                <ul className={styles.requestList}>
                  {myRequests.map((r) => {
                    const mentor = MENTORS.find((m) => m.id === r.mentorId);
                    return (
                      <li key={r.id}>
                        <div className={styles.receivedHeader}>
                          <strong>{mentor?.name || r.mentorName}</strong>
                          <span
                            className={`${styles.status} ${
                              styles[r.status.toLowerCase()]
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        {r.status === "Accepted" && r.mentorEmail && (
                          <a
                            href={`mailto:${r.mentorEmail}`}
                            className={styles.contactLink}
                          >
                            <Mail size={13} /> {r.mentorEmail}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link to="/mentorship" className={styles.sidebarLink}>
                <Users size={15} /> Find a Mentor
              </Link>
            </div>

            <div className={styles.card}>
              <h2>Explore the Network</h2>
              <div className={styles.quickLinks}>
                <Link to="/directory">Alumni Directory</Link>
                <Link to="/jobs">Job Board</Link>
                <Link to="/business-directory">Business Directory</Link>
                <Link to="/leadership">Alumni Leadership</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <DemoMembership />
        </div>
      </div>
    </div>
  );
};

export default Profile;
