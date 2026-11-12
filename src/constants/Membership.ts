import type { MembershipCategory } from "../types";

export const MEMBERSHIP_DUES = {
  Full: { NGN: 30000, USD: 50 },
  Associate: { NGN: 20000 },
  Honorary: { NGN: 0 },
} as const;

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = ["Full", "Associate", "Honorary"];

export function formatDues(amount: number, currency: "NGN" | "USD") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(amount);
}
