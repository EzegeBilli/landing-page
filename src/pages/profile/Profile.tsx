import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Camera,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import styles from "./Profile.module.css";
import { useAuth } from "../../context/auth/useAuth";
import type { ProfileFormValues } from "../../context/auth/authContextDef";
import { DISCIPLINES, DISCIPLINE_GROUPS, GRADUATION_YEARS } from "../../constants/Disciplines";
import { resizeImageFile } from "../../utils/resizeImage";
import { toast } from "../../components/toast/toast";
import type { PublicProfile } from "../../types";
import DemoMembership from "./DemoMembership";
import MentorshipRequests from "./MentorshipRequests";

// Limits enforced by PATCH /api/users/me/mentor.
const MAX_EXPERTISE_TAGS = 10;
const MAX_EXPERTISE_LENGTH = 60;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const formFromUser = (user: PublicProfile | null): ProfileFormValues => ({
  fullName: user?.fullName || "",
  discipline: user?.discipline || "",
  graduationYear: user?.graduationYear || "",
  currentRole: user?.currentRole || "",
  company: user?.company || "",
  location: user?.location || "",
  phone: user?.phone || "",
  bio: user?.bio || "",
});

const Profile = () => {
  const { user, isDemo, saveProfile, saveAvatar, saveMentorSettings, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [form, setForm] = useState(() => formFromUser(user));

  const [mentorEditing, setMentorEditing] = useState(false);
  const [mentorSaving, setMentorSaving] = useState(false);
  const [mentorError, setMentorError] = useState("");
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
  const [expertiseInput, setExpertiseInput] = useState(
    user?.mentorExpertise?.join(", ") || ""
  );

  if (!user) return null;

  // Keep a saved value selectable even if it isn't in the standard lists.
  const disciplineIsListed = (DISCIPLINES as readonly string[]).includes(form.discipline);
  const yearIsListed = (GRADUATION_YEARS as readonly string[]).includes(form.graduationYear);

  const startEditing = () => {
    setForm(formFromUser(user));
    setSaveError("");
    setEditing(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError("");
    const result = await saveProfile(form);
    setSaving(false);
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    setEditing(false);
    toast.success("Profile saved.");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }

    let dataUrl: string;
    try {
      dataUrl = await resizeImageFile(file);
    } catch {
      setAvatarError("Couldn't load that image. Try another one.");
      return;
    }

    setAvatarUploading(true);
    setAvatarError("");
    const result = await saveAvatar(dataUrl);
    setAvatarUploading(false);
    if (!result.ok) {
      setAvatarError(result.error);
      return;
    }
    toast.success("Profile photo updated.");
  };

  const startMentorEditing = () => {
    setIsMentor(user.isMentor || false);
    setExpertiseInput(user.mentorExpertise?.join(", ") || "");
    setMentorError("");
    setMentorEditing(true);
  };

  const handleSaveMentorSettings = async () => {
    if (mentorSaving) return;
    const mentorExpertise = expertiseInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (mentorExpertise.length > MAX_EXPERTISE_TAGS) {
      setMentorError(`Add at most ${MAX_EXPERTISE_TAGS} areas of expertise.`);
      return;
    }
    if (mentorExpertise.some((t) => t.length > MAX_EXPERTISE_LENGTH)) {
      setMentorError(`Each area must be ${MAX_EXPERTISE_LENGTH} characters or fewer.`);
      return;
    }

    setMentorSaving(true);
    setMentorError("");
    const result = await saveMentorSettings({ isMentor, mentorExpertise });
    setMentorSaving(false);
    if (!result.ok) {
      setMentorError(result.error);
      return;
    }
    setMentorEditing(false);
    toast.success("Mentor settings saved.");
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
              disabled={avatarUploading}
              aria-label={avatarUploading ? "Uploading profile picture" : "Change profile picture"}
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
            {avatarUploading && (
              <p className={styles.avatarError} role="status">Uploading photo…</p>
            )}
            {avatarError && (
              <p className={styles.avatarError} role="alert">{avatarError}</p>
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
                  onClick={startEditing}
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
                      <option value="">Select discipline</option>
                      {form.discipline && !disciplineIsListed && (
                        <option value={form.discipline}>{form.discipline}</option>
                      )}
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
                      <option value="">Select year</option>
                      {form.graduationYear && !yearIsListed && (
                        <option value={form.graduationYear}>{form.graduationYear}</option>
                      )}
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

                {saveError && (
                  <p className={styles.formError} role="alert">{saveError}</p>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
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
                    onClick={startMentorEditing}
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

                  {mentorError && (
                    <p className={styles.formError} role="alert">{mentorError}</p>
                  )}

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setMentorEditing(false)}
                      disabled={mentorSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveMentorSettings}
                      disabled={mentorSaving}
                    >
                      {mentorSaving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <MentorshipRequests userId={user.id} isMentor={!!user.isMentor} isDemo={isDemo} />

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
