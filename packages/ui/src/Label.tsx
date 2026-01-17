import * as React from "react";

import { cn } from "./utils";

/**
 * @component Label
 * @description A semantic label component for form elements.
 * @standard Neo-Victorian (Principle V - Digital Hospitality)
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, error, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-foreground transition-colors",
          // Error state
          error && "text-cyber-pink",
          className,
        )}
        {...props}
      >
        {children}
        {required && <span className="text-cyber-pink ml-0.5">*</span>}
      </label>
    );
  },
);
Label.displayName = "Label";

export { Label };
