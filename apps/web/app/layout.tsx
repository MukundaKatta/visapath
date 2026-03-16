import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisaPath - AI-Powered Immigration & Visa Navigation",
  description:
    "Navigate your immigration journey with AI-powered tools for visa assessment, form preparation, document tracking, and case management.",
  keywords: [
    "immigration",
    "visa",
    "H-1B",
    "green card",
    "USCIS",
    "immigration attorney",
    "visa assessment",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
