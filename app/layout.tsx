import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REX AI — Intelligent Next-Gen Assistant",
  description: "Meet REX AI. Your ideas. Your questions. One intelligent assistant.",
  keywords: ["AI", "Chatbot", "REX AI", "Assistant", "Artificial Intelligence", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="h-full bg-[#090B10] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
