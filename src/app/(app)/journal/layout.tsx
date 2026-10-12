import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Capture daily reflections with moods, tags, and searchable entries.",
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
