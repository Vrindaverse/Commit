import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/forms";
import { getCurrentUser } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your free Commit account and set up your personal command center.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
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