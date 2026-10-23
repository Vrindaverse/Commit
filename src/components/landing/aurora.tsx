export default function Aurora({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`aurora ${className}`}>
      <div className="aurora-blob aurora-a" />
      <div className="aurora-blob aurora-b" />
      <div className="aurora-blob aurora-c" />
    </div>
  );
}
