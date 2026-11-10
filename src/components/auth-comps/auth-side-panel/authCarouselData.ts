import graduationImage from "../../../assets/images/auth/graduation.jpg";
import campusImage from "../../../assets/images/auth/campus.jpg";
import cadetsImage from "../../../assets/images/auth/cadets.jpg";
import buildingImage from "../../../assets/images/auth/building.jpg";

export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  /** CSS background-position, to keep faces/subjects in frame on tall panels. */
  position?: string;
}

export const AUTH_CAROUSEL: CarouselSlide[] = [
  {
    image: graduationImage,
    title: "Celebrating Every Milestone",
    subtitle:
      "Join a community that shows up for your graduation, your first posting, and everything after.",
    position: "center",
  },
  {
    image: campusImage,
    title: "Where It All Began",
    subtitle:
      "The pioneer dedicated maritime university in Nigeria and West Africa.",
    position: "60% center",
  },
  {
    image: cadetsImage,
    title: "Charting Careers Across the Globe",
    subtitle:
      "From Okerenkoko to the world's busiest ports, NMU alumni are everywhere the sea takes them.",
    position: "center 30%",
  },
  {
    image: buildingImage,
    title: "Built on Connection",
    subtitle:
      "Mentorship, jobs, and lifelong friendships, all one login away.",
    position: "center",
  },
];
