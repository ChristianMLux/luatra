import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider, ThemeProvider } from "@repo/core";
import { ScrollProgress } from "@repo/ui";
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
  title: "Luatra Hub",
  description: "Administrative Dashboard",
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
            <ScrollProgress alwaysVisible />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
