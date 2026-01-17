import * as React from "react";

import { cn } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base: Glassmorphism, accessible text
            "flex h-10 w-full rounded-md border bg-glass-low backdrop-blur-md border-glass-border px-3 py-2 text-sm text-foreground ring-offset-background transition-all duration-200 ease-spring",
            // File input styling
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            // Placeholder
            "placeholder:text-muted-foreground",
            // Focus: High-contrast cyber-cyan ring with glow
            "focus-visible:outline-none focus-visible:border-cyber-cyan focus-visible:ring-1 focus-visible:ring-cyber-cyan focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error: Cyber-pink border
            error &&
              "border-cyber-pink focus-visible:ring-cyber-pink focus-visible:shadow-[0_0_15px_rgba(255,0,255,0.3)]",
            // Icon padding
            icon && "pl-10",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
