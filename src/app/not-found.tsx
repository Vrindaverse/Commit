import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/shared/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-16 text-center">
      <div className="neo-card w-full max-w-md p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] text-2xl font-extrabold shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-[#2A2A2A]">Page not found</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-[#5C5C5C]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="neo-button bg-[#CDEAC0] px-5 py-2.5 text-sm"
          >
            Back to dashboard
          </Link>
          <Link
            href="/login"
            className="neo-button bg-[#FFFDF8] px-5 py-2.5 text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
      <SiteFooter className="mt-8" />
    </main>
  );
}
