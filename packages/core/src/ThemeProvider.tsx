"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import Cookies from "js-cookie";
import { useEffect, useLayoutEffect } from "react";

const THEME_COOKIE_NAME = "luatra-theme";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Syncs theme state between cookie and localStorage/next-themes
 */
function ThemeSyncProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();

  // On mount, read cookie and force theme to match
  useIsomorphicLayoutEffect(() => {
    const cookieTheme = Cookies.get(THEME_COOKIE_NAME);
    if (cookieTheme && cookieTheme !== theme) {
      // Force next-themes to use cookie value
      setTheme(cookieTheme);
    }
  }, []); // Run only on mount

  // Watch for theme changes and sync to cookie
  useEffect(() => {
    if (theme && theme !== "system") {
      Cookies.set(THEME_COOKIE_NAME, theme, {
        expires: 365,
        sameSite: "lax",
        path: "/",
      });
    }
  }, [theme]);

  return <>{children}</>;
}

/**
 * @component ThemeProvider
 * @description Global theme provider using next-themes with cookie-based storage.
 * Uses cookies for cross-app theme persistence between Hub and Joatra.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Pre-hydration: sync localStorage from cookie to avoid flash
  if (typeof window !== "undefined") {
    const cookieTheme = Cookies.get(THEME_COOKIE_NAME);
    if (cookieTheme) {
      // Set localStorage so next-themes picks up the correct value immediately
      const currentLocalTheme = localStorage.getItem("theme");
      if (currentLocalTheme !== cookieTheme) {
        localStorage.setItem("theme", cookieTheme);
      }
    }
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme"
      {...props}
    >
      <ThemeSyncProvider>{children}</ThemeSyncProvider>
    </NextThemesProvider>
  );
}
