import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";
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
      <Sidebar />
      <MainContent>{children}</MainContent>
    </HydrateStore>
  );
}