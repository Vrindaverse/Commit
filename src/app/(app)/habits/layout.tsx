import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits",
  description: "Build lasting habits with daily tracking, streaks, and a contribution grid.",
};

export default function HabitsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
