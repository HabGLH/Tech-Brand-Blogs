import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import RootLayoutWrapper from "./layout-wrapper";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "blog app",
  description:
    "A simple blog app built with Next.js 13, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${headingFont.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutWrapper>{children}</RootLayoutWrapper>
      </body>
    </html>
  );
}
