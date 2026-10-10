import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/forms";
import { verifySession } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Create account — Commit",
};

export default async function SignupPage() {
  try {
    await verifySession();
    redirect('/');
  } catch {
    // Not authenticated, show signup page
  }
  return (
    <AuthCard
      title="Create your account"
      subtitle="Set up your personal command center."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}