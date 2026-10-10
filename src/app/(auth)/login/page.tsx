import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/forms";
import { verifySession } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Sign in — Commit",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  try {
    await verifySession();
    redirect(next || '/');
  } catch {
    // Not authenticated, show login page
  }
  return (
    <div className="min-h-screen w-full bg-[#F8F5F0] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to continue to your dashboard."
          footer={
            <>
              New here?{" "}
              <Link href="/signup" className="font-extrabold underline underline-offset-2 hover:text-[#F7E8A4] transition-colors">
                Create an account
              </Link>
            </>
          }
        >
          <LoginForm next={next} />
        </AuthCard>
      </div>
    </div>
  );
}