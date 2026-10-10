import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare, Target, Flame, BookOpen } from "lucide-react";
import { LoginForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "Sign in — Commit",
};

const HIGHLIGHTS = [
  { icon: CheckSquare, title: "Tasks", note: "Capture & knock out your to-dos" },
  { icon: Target, title: "Goals", note: "Milestones that build momentum" },
  { icon: Flame, title: "Habits", note: "Streaks that keep you on track" },
  { icon: BookOpen, title: "Learning", note: "Resources & exam prep" },
];

function FeatureRow({
  icon: Icon,
  title,
  note,
}: (typeof HIGHLIGHTS)[number]) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 shrink-0 rounded-xl border-[2px] border-[#FFFDF8] bg-[#F7E8A4] text-[#2A2A2A] flex items-center justify-center">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-[#FFFDF8] leading-tight">{title}</p>
        <p className="text-[11px] font-medium text-[#B8B2A8] leading-snug">{note}</p>
      </div>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="w-full max-w-3xl animate-fade-up">
      <div className="neo-card overflow-hidden grid md:grid-cols-2">
        <div className="relative bg-[#2D2D2D] p-7 flex flex-col gap-6 md:rounded-l-[17px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden md:rounded-l-[17px]">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border-[3px] border-dashed border-[#F7E8A4]/50 animate-spin-slow" />
            <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full border-[3px] border-[#F7E8A4]/70" />
            <div className="pointer-events-none absolute -top-2 -right-6 w-24 h-24 rounded-full border-[3px] border-[#B8D8F8]/50" />
            <div className="pointer-events-none absolute top-16 -right-4 w-10 h-10 rounded-full bg-[#CDEAC0]/60" />
            <div className="pointer-events-none absolute bottom-10 -left-6 w-20 h-20 rounded-full bg-[#B8D8F8]/20" />
          </div>

          <div className="flex items-center gap-3 relative animate-fade-up delay-1">
            <div className="w-10 h-10 rounded-xl border-[3px] border-[#FFFDF8] bg-[#F7E8A4] flex items-center justify-center text-lg font-extrabold flex-shrink-0">
              L
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-tight text-[#FFFDF8]">Commit</h1>
              <p className="text-[10px] text-[#B8B2A8] font-semibold">Personal Command Center</p>
            </div>
          </div>

          <div className="relative animate-fade-up delay-2">
            <h2 className="text-2xl font-extrabold leading-[1.1] text-[#FFFDF8]">
              Your life,
              <br />
              in command.
            </h2>
            <p className="mt-2 text-[13px] font-medium text-[#B8B2A8] leading-relaxed">
              Goals, tasks, habits and learning — one friendly console to keep it all moving.
            </p>
          </div>

          <div className="space-y-3 relative mt-auto pt-2">
            {HIGHLIGHTS.map((item, i) => (
              <div key={item.title} className={`animate-fade-up delay-${i + 2}`}>
                <FeatureRow {...item} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFDF8] p-7 md:p-8 flex flex-col">
          <div className="mb-6 animate-fade-up delay-1">
            <h2 className="text-xl font-extrabold text-[#2A2A2A]">Welcome back</h2>
            <p className="text-xs font-medium text-[#5C5C5C] mt-1">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <div className="animate-fade-up delay-2">
            <LoginForm next={next} />
          </div>

          <div className="mt-auto pt-6 border-t-[3px] border-[#2D2D2D] animate-fade-up delay-3">
            <p className="text-xs font-bold text-[#5C5C5C] text-center">
              New here?{" "}
              <Link href="/signup" className="text-[#2A2A2A] underline underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}