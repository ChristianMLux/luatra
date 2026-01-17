"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "./utils";

/**
 * @component ThemeToggle
 * @description A button to toggle between light and dark themes.
 * @standard Neo-Victorian (cyber-noir styling)
 */
export interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-full bg-glass-low border border-glass-border animate-pulse",
          size === "sm" && "p-1.5",
          size === "md" && "p-2",
          size === "lg" && "p-2.5",
          className,
        )}
      >
        <div
          className={cn(
            size === "sm" && "h-4 w-4",
            size === "md" && "h-5 w-5",
            size === "lg" && "h-6 w-6",
          )}
        />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const iconSize = cn(
    size === "sm" && "h-4 w-4",
    size === "md" && "h-5 w-5",
    size === "lg" && "h-6 w-6",
  );

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "rounded-full bg-glass-low border border-glass-border",
        "hover:border-cyber-neon/50 transition-all duration-200 ease-spring",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon",
        size === "sm" && "p-1.5",
        size === "md" && "p-2",
        size === "lg" && "p-2.5",
        className,
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className={cn(iconSize, "text-cyber-warning")} />
      ) : (
        <Moon className={cn(iconSize, "text-foreground")} />
      )}
    </button>
  );
}
