import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Visualize productivity trends, goal completion, and habit streaks over time.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
