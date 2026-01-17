import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider, ThemeProvider } from "@repo/core";
import { Toaster, ScrollProgress } from "@repo/ui";
import { Navbar } from "@/components/layout/Navbar";
import { JobsProvider } from "@/lib/context/JobsContext";
import "@repo/ui/global.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Luatra Joatra",
  description: "Journaling Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <JobsProvider>
              <ScrollProgress alwaysVisible />
              <Navbar />
              {children}
              <Toaster />
            </JobsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
