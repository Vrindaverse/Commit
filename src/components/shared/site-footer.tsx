export default function SiteFooter({ className = "" }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className={`text-center text-[11px] font-semibold text-[#5C5C5C] ${className}`}>
      <p>&copy; {year} Commit &middot; Built for focus and follow-through</p>
    </footer>
  );
}
