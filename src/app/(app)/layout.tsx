import type { Metadata } from "next";
import Dock from "@/components/layout/dock";
import MainContent from "@/components/layout/main-content";
import HydrateStore from "@/components/layout/hydrate-store";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your daily overview of goals, tasks, habits, and progress.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HydrateStore>
      <Dock />
      <MainContent>{children}</MainContent>
    </HydrateStore>
  );
}