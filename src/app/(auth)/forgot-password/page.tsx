import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "Reset password — Commit",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll send a code to your email."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-extrabold underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}