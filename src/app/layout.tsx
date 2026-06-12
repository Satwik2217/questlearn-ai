import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "QuestLearn AI - Learn Through Adventure",
  description:
    "Embark on an epic learning adventure! Master subjects through quests, boss battles, and challenges in a gamified AI-powered educational platform.",
  keywords: [
    "gamified learning",
    "educational game",
    "AI learning",
    "quests",
    "boss battles",
    "study game",
  ],
  authors: [{ name: "QuestLearn AI" }],
  openGraph: {
    title: "QuestLearn AI - Learn Through Adventure",
    description:
      "Master subjects through quests, boss battles, and challenges in a gamified AI-powered educational platform.",
    type: "website",
    siteName: "QuestLearn AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestLearn AI - Learn Through Adventure",
    description:
      "Master subjects through quests, boss battles, and challenges in a gamified AI-powered educational platform.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} dark h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
