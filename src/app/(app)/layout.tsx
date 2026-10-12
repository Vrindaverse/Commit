import type { Metadata } from "next";
import Dock from "@/components/layout/dock";
import MainContent from "@/components/layout/main-content";
import HydrateStore from "@/components/layout/hydrate-store";
import MobileProfileButton from "@/components/layout/mobile-profile-button";

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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 neo-button px-4 py-2 text-sm bg-[#F7E8A4]"
      >
        Skip to content
      </a>
      <MobileProfileButton />
      <MainContent>{children}</MainContent>
    </HydrateStore>
  );
}