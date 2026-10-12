export default function SiteFooter({ className = "" }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className={`text-center text-[11px] font-semibold text-[#5C5C5C] ${className}`}>
      <p>&copy; {year} Commit &middot; Built for focus and follow-through</p>
      <p className="mt-1">Made by Nikhil Mahalik</p>
      <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
        <a
          href="mailto:vrindaverse78@gmail.com"
          className="hover:text-[#2A2A2A] transition-colors underline underline-offset-2"
        >
          vrindaverse78@gmail.com
        </a>
        <span className="opacity-40">|</span>
        <a
          href="https://github.com/Vrindaverse"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#2A2A2A] transition-colors underline underline-offset-2"
        >
          @Vrindaverse
        </a>
        <span className="opacity-40">|</span>
        <a
          href="tel:+9149411249"
          className="hover:text-[#2A2A2A] transition-colors underline underline-offset-2"
        >
          +91 49411249
        </a>
      </div>
    </footer>
  );
}
