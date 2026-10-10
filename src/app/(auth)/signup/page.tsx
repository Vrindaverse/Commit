import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "Create account — Commit",
};

export default function SignupPage() {
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