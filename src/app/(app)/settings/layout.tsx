import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Commit preferences, export your data, and control your account.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
