import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance",
  description: "Track earnings, expenses, budgets, and loans with clear monthly insights.",
};

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
