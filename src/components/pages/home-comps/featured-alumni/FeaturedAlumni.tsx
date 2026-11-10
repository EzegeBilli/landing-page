import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import styles from "./FeaturedAlumni.module.css";

interface AlumniProfile {
  name: string;
  year: string;
  discipline: string;
  role: string;
  quote: string;
  img: string;
}

const ALUMNI: AlumniProfile[] = [
  {
    name: "Capt. Ibrahim Bello",
    year: "2022",
    discipline: "B.Sc. Nautical Science",
    role: "Navigation Officer, Nigerian Navy",
    quote: "NMU instilled the regimented discipline I rely on every day at sea.",
    img: "https://images.unsplash.com/photo-1614249706471-36016b37b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3NtYW58ZW58MXx8fHwxNzc2MTY5NzMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Engr. Nneka Eze",
    year: "2023",
    discipline: "B.Eng. Marine Engineering",
    role: "Chief Engineer, NLNG",
    quote: "The hands-on training at Escravos River prepared me for global challenges.",
    img: "https://images.unsplash.com/photo-1563132337-f159f484226c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3N3b21hbnxlbnwxfHx8fDE3NzYxNjk3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Dr. Olayinka Adeyemi",
    year: "2021",
    discipline: "B.Sc. Marine Economics & Finance",
    role: "Port Operations Manager, Apapa Port",
    quote: "My network from NMU remains my most valuable career asset.",
    img: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NzYwODI0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Aisha Mohammed",
    year: "2024",
    discipline: "B.Sc. Meteorology & Climate Change",
    role: "Climate Researcher, NIMET",
    quote: "We are the pioneers of environmental maritime safety in Africa.",
    img: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc3NjE2NjAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function FeaturedAlumni() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header row */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading}>Pioneers of Maritime Excellence</h2>
            <p className={styles.subheading}>
              Meet our distinguished alumni making waves across the global
              maritime industry.
            </p>
          </div>
          <Link to="/directory" className={styles.viewAllDesktop}>
            View All Alumni <ArrowRight size={18} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {ALUMNI.map((alumni) => (
            <div key={alumni.name} className={styles.card}>
              <img
                src={alumni.img}
                alt={alumni.name}
                className={styles.avatar}
              />
              <h3 className={styles.name}>{alumni.name}</h3>
              <p className={styles.discipline}>
                {alumni.discipline}, &apos;{alumni.year.slice(-2)}
              </p>
              <p className={styles.role}>{alumni.role}</p>
              <div className={styles.quoteWrap}>
                <p className={styles.quote}>&ldquo;{alumni.quote}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view-all link */}
        <div className={styles.viewAllMobile}>
          <Link to="/directory" className={styles.viewAllLink}>
            View All Alumni <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}