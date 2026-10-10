import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { VerifyCodeForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "Verify email — Commit",
};

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify your email"
      subtitle="We emailed a 6-digit code. Enter it below to activate your account."
      footer={
        <>
          Prefer to sign in?{" "}
          <Link href="/login" className="font-extrabold underline underline-offset-2">
            Go to login
          </Link>
        </>
      }
    >
      <VerifyCodeForm endpoint="/api/auth/verify-email" purpose="account activation" />
    </AuthCard>
  );
}