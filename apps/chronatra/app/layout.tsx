import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider, ThemeProvider } from "@repo/core";
import { Toaster, ScrollProgress } from "@repo/ui";
import { Navbar } from "@/components/layout/Navbar";
import { TimerProvider } from "@/lib/context/TimerContext";
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
  title: "Luatra Chronatra",
  description: "Time Intelligence & Work-Life Balance",
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
            <TimerProvider>
              <ScrollProgress alwaysVisible />
              <Navbar />
              {children}
              <Toaster />
            </TimerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
