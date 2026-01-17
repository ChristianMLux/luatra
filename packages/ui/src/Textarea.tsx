import * as React from "react";

import { cn } from "./utils";

/**
 * @component Textarea
 * @description A multiline text input with glassmorphism styling.
 * @standard Neo-Victorian (Principle V - Digital Hospitality)
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base: Glassmorphism, accessible text
          "flex min-h-[80px] w-full rounded-md border bg-glass-low backdrop-blur-md border-glass-border px-3 py-2 text-sm text-foreground ring-offset-background transition-all duration-200 ease-spring",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Focus: High-contrast cyber-cyan ring with glow
          "focus-visible:outline-none focus-visible:border-cyber-cyan focus-visible:ring-1 focus-visible:ring-cyber-cyan focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Resize
          "resize-none",
          // Error: Cyber-pink border
          error &&
            "border-cyber-pink focus-visible:ring-cyber-pink focus-visible:shadow-[0_0_15px_rgba(255,0,255,0.3)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
