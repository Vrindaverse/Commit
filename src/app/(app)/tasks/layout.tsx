import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Plan and manage tasks with list, kanban, and calendar views.",
};

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
