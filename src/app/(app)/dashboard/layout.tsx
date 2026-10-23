import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your daily overview of goals, tasks, habits, and progress.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
