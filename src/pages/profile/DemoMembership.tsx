import { useState } from "react";
import { useAuth } from "../../context/auth/useAuth";
import { MEMBERSHIP_CATEGORIES, MEMBERSHIP_DUES, formatDues } from "../../constants/Membership";
import type { DemoDuesPayment, MembershipCategory } from "../../types";
import styles from "./DemoMembership.module.css";

const dateLabel = (value: string) => new Intl.DateTimeFormat("en-NG", {
  day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos",
}).format(new Date(value));

export default function DemoMembership() {
  const { user, updateProfile } = useAuth();
  const [diaspora, setDiaspora] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [message, setMessage] = useState("");
  if (user?.id !== "demo-user") return null;

  const category = user.demoMembershipCategory ?? "Full";
  const payments = user.demoDuesPayments ?? [];
  const activePayment = payments.find(payment => payment.category === category && new Date(payment.validUntil).getTime() > Date.now());
  const exempt = category === "Honorary";
  const currency = category === "Full" && diaspora ? "USD" : "NGN";
  const amount = currency === "USD" ? MEMBERSHIP_DUES.Full.USD : MEMBERSHIP_DUES[category].NGN;

  function changeCategory(value: MembershipCategory) {
    updateProfile({ demoMembershipCategory: value });
    setCheckout(false);
    setMessage("");
  }

  function simulatePayment() {
    if (exempt || activePayment || !checkout) return;
    const paidAt = new Date();
    const validUntil = new Date(paidAt);
    // Preserve the day where possible, including payments made on leap day.
    const month = validUntil.getUTCMonth();
    validUntil.setUTCFullYear(validUntil.getUTCFullYear() + 1);
    if (validUntil.getUTCMonth() !== month) validUntil.setUTCDate(0);
    const payment: DemoDuesPayment = {
      reference: `DEMO-${crypto.randomUUID()}`,
      category, amount, currency,
      paidAt: paidAt.toISOString(), validUntil: validUntil.toISOString(),
    };
    updateProfile({ demoDuesPayments: [payment, ...payments] });
    setCheckout(false);
    setMessage("Demo payment completed. No money was charged.");
  }

  return <section className={styles.card} aria-labelledby="membership-title">
    <div className={styles.header}><h2 id="membership-title">Membership & annual dues</h2><span className={styles.demo}>Demo only</span></div>
    <p className={styles.note}>Try the membership payment flow. No real payments are processed. Demo records are saved in this browser.</p>
    <div className={styles.summary}>
      <div><span>Membership category</span><strong>{category} Member</strong></div>
      <div><span>Annual subscription</span><strong>{exempt ? "Exempt" : formatDues(amount, currency)}</strong></div>
      <div><span>Dues status</span><strong>{exempt ? "Exempt from annual dues" : activePayment ? "Paid (demo)" : "Unpaid (demo)"}</strong></div>
      <div><span>Renewal date</span><strong>{exempt ? "Not applicable" : activePayment ? dateLabel(activePayment.validUntil) : "12 months after payment"}</strong></div>
    </div>
    <details className={styles.scenarios}>
      <summary>Try another demo membership</summary>
      <label htmlFor="demo-membership-category">Preview category</label>
      <select id="demo-membership-category" value={category} onChange={event => changeCategory(event.target.value as MembershipCategory)}>
        {MEMBERSHIP_CATEGORIES.map(value => <option key={value} value={value}>{value} Member</option>)}
      </select>
      <p>This selector is for the demo account only. Honorary membership is conferred by the National General Assembly; payment does not award membership.</p>
    </details>
    {category === "Full" && !activePayment && <label className={styles.checkbox}><input type="checkbox" checked={diaspora} onChange={event => { setDiaspora(event.target.checked); setCheckout(false); }} /> Use diaspora subscription (USD 50/year)</label>}
    {!exempt && !activePayment && !checkout && <button type="button" className={styles.primary} onClick={() => { setMessage(""); setCheckout(true); }}>Pay annual dues · Demo</button>}
    {checkout && !exempt && !activePayment && <div className={styles.checkout}>
      <h3>Review demo payment</h3>
      <p>{category} membership · {formatDues(amount, currency)} · 12 months</p>
      <p>No card or bank details are needed.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={simulatePayment}>Simulate successful payment</button>
        <button type="button" onClick={() => { setCheckout(false); setMessage("Demo payment cancelled. No payment was recorded."); }}>Cancel</button>
      </div>
    </div>}
    <p role="status" className={styles.message}>{message}</p>
    <h3>Demo payment history</h3>
    {payments.length === 0 ? <p className={styles.note}>No demo payments yet.</p> : <ul className={styles.history}>{payments.map(payment => <li key={payment.reference}>
      <div><strong>{formatDues(payment.amount, payment.currency)}</strong><span>{payment.category} annual dues · Paid (demo)</span></div>
      <p>{dateLabel(payment.paidAt)} · Valid until {dateLabel(payment.validUntil)}</p>
      <small>Reference: {payment.reference}</small>
    </li>)}</ul>}
  </section>;
}
