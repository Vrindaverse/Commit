import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { VerifyCodeForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "Enter code — Commit",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthCard
      title="Enter your code"
      subtitle="We emailed a 6-digit code to verify your sign-in."
      footer={
        <>
          Wrong account?{" "}
          <Link href="/login" className="font-extrabold underline underline-offset-2">
            Sign in again
          </Link>
        </>
      }
    >
      <VerifyCodeForm endpoint="/api/auth/verify-otp" purpose="sign in" next={next} />
    </AuthCard>
  );
}