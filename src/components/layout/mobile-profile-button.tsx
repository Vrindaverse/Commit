'use client';

export default function MobileProfileButton() {
  return (
    <div className="md:hidden">
      <button
        onClick={() => window.location.href = '#profile'}
        aria-label="Open profile"
        className="fixed top-4 left-4 z-40 w-11 h-11 rounded-full border-[3px] border-[#2D2D2D] bg-[#FFFDF8] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:bg-[#F0ECE4] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#CDEAC0] flex items-center justify-center text-[2xl] font-bold">C</div>
      </button>
    </div>
  );
}
