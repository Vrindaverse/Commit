import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Manage active projects, milestones, and tasks in one view.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
