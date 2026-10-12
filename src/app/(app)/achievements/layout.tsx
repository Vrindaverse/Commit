import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Unlock achievements and celebrate your progress across every area of life.",
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
