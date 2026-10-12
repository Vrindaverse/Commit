import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description: "Track learning paths, modules, and skill development progress.",
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
