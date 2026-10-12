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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 neo-button px-4 py-2 text-sm bg-[#F7E8A4]"
      >
        Skip to content
      </a>
      <div className="md:hidden">
        <button
          onClick={() => window.location.href='#profile'}
          aria-label="Open profile"
          className="fixed top-4 left-4 z-40 w-11 h-11 rounded-full border-[3px] border-[#2D2D2D] bg-[#FFFDF8] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:bg-[#F0ECE4] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#CDEAC0] flex items-center justify-center text-[2xl] font-bold">C</div>
        </button>
      </div>
      <MainContent>{children}</MainContent>
    </HydrateStore>
  );
}