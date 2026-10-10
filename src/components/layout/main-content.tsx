export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="pb-20 md:pb-0 min-h-screen focus:outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </main>
  );
}
