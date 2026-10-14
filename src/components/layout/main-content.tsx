import SiteFooter from "@/components/shared/site-footer";

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="min-h-screen pb-[calc(var(--dock-height,4.75rem)+2rem)] focus:outline-none md:pb-0"
    >
      {/* pt reserves room for the fixed mobile hamburger / streak badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pr-[18rem] pt-16 pb-6 sm:pt-8 sm:pb-8">
        {children}
        <SiteFooter className="mt-12 border-t-[2px] border-[#E3DED4] pt-5" />
      </div>
    </main>
  );
}
