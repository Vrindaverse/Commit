import SiteFooter from "@/components/shared/site-footer";

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="pb-24 md:pb-0 min-h-screen focus:outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pr-[18rem] py-6 sm:py-8">
        {children}
        <SiteFooter className="mt-12 border-t-[2px] border-[#E3DED4] pt-5" />
      </div>
    </main>
  );
}
