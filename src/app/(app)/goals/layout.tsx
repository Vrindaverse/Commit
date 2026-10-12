import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goals",
  description: "Set long, medium, and short-term goals and track milestones to completion.",
};

export default function GoalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
