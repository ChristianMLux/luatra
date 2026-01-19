import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider, ThemeProvider } from "@repo/core";
import { Toaster, ScrollProgress } from "@repo/ui";
import { Navbar } from "@/components/layout/Navbar";
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
  title: "Finatra - Financial Intelligence",
  description: "AI-powered financial tracking and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <AuthProvider>
              <ScrollProgress alwaysVisible />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
