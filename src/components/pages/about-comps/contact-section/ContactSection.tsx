import shared from "../aboutShared.module.css";
import styles from "./ContactSection.module.css";

const channels = [
  { label: "Headquarters", value: "Nigeria Maritime University Alumni Association, Delta State, Nigeria" },
  { label: "Email", value: "info@nmuaa.org.ng", href: "mailto:info@nmuaa.org.ng" },
  { label: "Phone", value: "+234 (0) (placeholder)", href: "tel:+234000000000" },
  { label: "Website", value: "www.nmuaa.org.ng", href: "https://www.nmuaa.org.ng", external: true },
];

const socials = ["X / Twitter", "LinkedIn", "Facebook", "Instagram"];

const ContactSection = () => {
  return (
    <section id="contact" className={shared.section} aria-labelledby="contact-title">
      <div className={shared.inner}>
        <header className={shared.head}>
          <span className={shared.index}><b>07</b>Get in touch</span>
          <div>
            <h2 id="contact-title" className={shared.title}>Contact us</h2>
            <p className={shared.lede}>
              Have a question, suggestion, or want to learn more about NMUAA? Reach us through any of the
              channels below, or send a message.
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <div>
            <dl className={styles.channels}>
              {channels.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}</dt>
                  <dd>
                    {c.href ? (
                      <a href={c.href} {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}>{c.value}</a>
                    ) : c.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className={styles.follow}>
              <span>Follow us</span>
              <ul>
                {socials.map((s) => <li key={s}><a href="#">{s}</a></li>)}
              </ul>
            </div>
          </div>

          <form className={styles.form}>
            <h3>Send us a message</h3>
            <div className={styles.pair}>
              <label className={styles.field}>
                <span>Full name</span>
                <input type="text" name="name" autoComplete="name" placeholder="Your full name" />
              </label>
              <label className={styles.field}>
                <span>Email address</span>
                <input type="email" name="email" autoComplete="email" placeholder="you@example.com" />
              </label>
            </div>
            <label className={styles.field}>
              <span>Subject</span>
              <input type="text" name="subject" placeholder="What is your message about?" />
            </label>
            <label className={styles.field}>
              <span>Message</span>
              <textarea name="message" rows={6} placeholder="Type your message here" />
            </label>
            <div className={styles.submitRow}>
              <button type="submit">Send message</button>
              <small>We typically respond within 2–3 working days.</small>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
