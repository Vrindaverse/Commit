import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account — Commit",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-paper">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}