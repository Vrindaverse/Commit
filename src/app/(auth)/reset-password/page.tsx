import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/forms";

export const metadata: Metadata = {
  title: "New password — Commit",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Enter the code from your email and your new password."
      footer={
        <>
          Changed your mind?{" "}
          <Link href="/login" className="font-extrabold underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}