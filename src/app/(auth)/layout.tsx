import type { Metadata } from "next";
import SiteFooter from "@/components/shared/site-footer";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in to Commit, your personal command center for goals, tasks, habits, learning, academics, and finances.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-6 p-4 bg-paper">
      <div className="w-full max-w-md">{children}</div>
      <SiteFooter />
    </div>
  );
}