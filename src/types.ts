export interface MemberProfile {
  id: string;
  name: string;
  title: string;
  profession: string;
  tenure: string;
  image: string;
  driveId?: string;
  rank?: string;
  shortBio: string;
  fullBio: string;
  category: "executive" | "directors" | "members" | "trustees";
}
export type EventStatus = "Upcoming" | "Ongoing" | "Past";

export interface Event {
  id: string;
  title: string;
  date: string;      // display string, e.g. "Oct 15, 2026"
  time: string;      // display string, e.g. "18:00 - 23:00 EST"
  location: string;
  image: string;
  status: EventStatus;
}
export interface Trustee {
  id: string;
  name: string;
  title: string;
  profession: string;
  experience?: string;
  tenure: string;
  image: string;
  isChair?: boolean;
  bio?: string;
}

export interface Member {
  id: string;
  title: string;
  name: string;
  profession: string;
  tenure: string;
  image: string;
}

export type NewsCategory =
  | "News"
  | "Blog"
  | "Achievement"
  | "Announcement"
  | "Career";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export type GalleryCategory =
  | "Events"
  | "Graduation"
  | "Campus Life"
  | "Reunions"
  | "Sports";

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  category: GalleryCategory;
  date?: string;
}

export interface SpotlightPerson {
  type: "Alumnus" | "Cadet";
  month: string;
  name: string;
  role: string;
  discipline: string;
  photo: string;
  achievement: string;
  quote: string;
}

/* ========== Accounts (demo-only, browser-local) ========== */

export type MemberType = "Alumnus" | "Cadet" | "Staff";

export type MembershipCategory = "Full" | "Associate" | "Honorary";
export interface DemoDuesPayment {
  reference: string;
  category: MembershipCategory;
  amount: number;
  currency: "NGN" | "USD";
  paidAt: string;
  validUntil: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  memberType: MemberType;
  demoMembershipCategory?: MembershipCategory;
  demoDuesPayments?: DemoDuesPayment[];
  graduationYear: string;
  discipline: string;
  currentRole?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  isMentor?: boolean;
  mentorExpertise?: string[];
  createdAt: string;
}

export type PublicProfile = Omit<AuthUser, "passwordHash">;

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  memberType: MemberType;
  graduationYear: string;
  discipline: string;
}

/* ========== Mentorship ========== */

export interface MentorProfile {
  id: string;
  name: string;
  photo: string;
  discipline: string;
  role: string;
  company: string;
  graduationYear: string;
  yearsExperience: string;
  expertiseTags: string[];
  bio: string;
  email?: string;
  isMember?: boolean;
}

export type MentorRequestStatus = "Pending" | "Accepted" | "Declined";

export interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail?: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  status: MentorRequestStatus;
  createdAt: string;
}

/* ========== Alumni Directory ========== */

export interface DirectoryAlumnus {
  id: string;
  name: string;
  photo: string;
  discipline: string;
  graduationYear: string;
  role: string;
  company: string;
  location: string;
}

/* ========== Job Board ========== */

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: string;
  description: string;
  applyEmail?: string;
  applyLink?: string;
  postedBy: string;
  postedDate: string;
  isUserSubmitted?: boolean;
}

/* ========== Business Directory & Sponsors ========== */

export interface BusinessListing {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  description: string;
  logo: string;
  coverImage: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  isUserSubmitted?: boolean;
}

export interface SponsorPartner {
  id: string;
  name: string;
  logo: string;
  tier: "Platinum" | "Gold" | "Silver";
  website?: string;
}
