import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/theme-provider";
import Toaster from "@/components/shared/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Commit — Personal Command Center",
    template: "%s · Commit",
  },
  description:
    "Commit is your personal operating system for life management — plan goals, track tasks, build habits, prepare for exams, journal, and manage your finances in one calm, focused console.",
  applicationName: "Commit",
  keywords: [
    "personal productivity",
    "goal tracking",
    "habit tracker",
    "task manager",
    "study planner",
    "expense tracker",
    "journal",
    "life management",
  ],
  authors: [{ name: "Commit" }],
  creator: "Commit",
  openGraph: {
    type: "website",
    siteName: "Commit",
    title: "Commit — Personal Command Center",
    description:
      "Plan goals, track tasks, build habits, prepare for exams, journal, and manage your finances in one calm, focused console.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Commit — Personal Command Center",
    description:
      "Plan goals, track tasks, build habits, prepare for exams, journal, and manage your finances in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F5F0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-x-hidden bg-[#F8F5F0] text-[#2A2A2A]">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
