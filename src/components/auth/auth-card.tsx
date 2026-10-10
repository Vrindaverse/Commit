export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="neo-card p-8 w-full">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center text-xl font-extrabold flex-shrink-0">
          L
        </div>
        <div>
          <h1 className="text-xl font-extrabold leading-tight text-[#2A2A2A]">Commit</h1>
          <p className="text-[10px] text-[#5C5C5C] font-semibold">Personal Command Center</p>
        </div>
      </div>
      <h2 className="text-lg font-extrabold mb-1 text-[#2A2A2A]">{title}</h2>
      {subtitle ? (
        <p className="text-xs text-[#5C5C5C] font-medium mb-6">{subtitle}</p>
      ) : null}
      {children}
      {footer ? (
        <div className="mt-7 pt-5 border-t-[3px] border-[#2D2D2D] text-center">
          {footer}
        </div>
      ) : null}
    </div>
  );
}