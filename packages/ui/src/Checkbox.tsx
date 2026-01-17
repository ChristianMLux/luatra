import * as React from "react";

import { cn } from "./utils";

/**
 * @component Checkbox
 * @description A styled checkbox with cyber accent.
 * @standard Neo-Victorian (Principle I - Intentional Ornamentation)
 */
export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            // Base
            "h-4 w-4 rounded border-glass-border bg-glass-low cursor-pointer transition-all duration-200",
            // Checked state
            "checked:bg-cyber-neon checked:border-cyber-neon",
            // Focus
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm text-foreground cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
