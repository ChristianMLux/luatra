import * as React from "react";

import { cn } from "./utils";

/**
 * @component Select
 * @description A native select with glassmorphism styling.
 * @standard Neo-Victorian (Principle V, VII - Digital Hospitality, Material Honesty)
 */
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          // Base: Glassmorphism, accessible text
          "flex h-10 w-full rounded-md border bg-glass-low backdrop-blur-md border-glass-border px-3 py-2 text-sm text-foreground ring-offset-background transition-all duration-200 ease-spring",
          // Appearance
          "appearance-none cursor-pointer",
          // Background arrow
          "bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23EAEAEA\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')] bg-no-repeat bg-[right_0.5rem_center] pr-8",
          // Focus: High-contrast cyber-cyan ring with glow
          "focus-visible:outline-none focus-visible:border-cyber-cyan focus-visible:ring-1 focus-visible:ring-cyber-cyan focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error: Cyber-pink border
          error &&
            "border-cyber-pink focus-visible:ring-cyber-pink focus-visible:shadow-[0_0_15px_rgba(255,0,255,0.3)]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
