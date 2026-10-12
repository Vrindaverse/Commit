import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academics",
  description: "Track subjects, attendance, assignments, and exam dates in one place.",
};

export default function AcademicsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
