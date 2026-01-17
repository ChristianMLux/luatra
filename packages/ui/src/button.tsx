import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./utils";

const buttonVariants = cva(
  // Base: relative positioning for 3D effect, spring transition, custom focus ring
  "relative inline-flex items-center justify-center overflow-hidden rounded-md text-sm font-bold uppercase tracking-widest transition-all duration-200 ease-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default: Tactile neon button with 3D states
        default:
          "bg-cyber-neon/10 text-cyber-neon backdrop-blur-md border border-cyber-neon/50 shadow-tactile-md hover:bg-cyber-neon/20 hover:-translate-y-[2px] hover:shadow-tactile-lg active:translate-y-[2px] active:shadow-tactile-active",
        destructive:
          "bg-destructive/10 text-destructive backdrop-blur-md border border-destructive/50 shadow-tactile-md hover:bg-destructive/20 hover:-translate-y-[2px] hover:shadow-tactile-lg active:translate-y-[2px] active:shadow-tactile-active",
        outline:
          "border border-glass-border bg-glass-low backdrop-blur-md hover:bg-glass-medium hover:-translate-y-[2px] hover:shadow-tactile-lg active:translate-y-[2px] active:shadow-tactile-active",
        secondary:
          "bg-secondary/80 text-secondary-foreground backdrop-blur-md border border-secondary shadow-tactile-md hover:bg-secondary hover:-translate-y-[2px] hover:shadow-tactile-lg active:translate-y-[2px] active:shadow-tactile-active",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm hover:-translate-y-[1px] active:translate-y-[1px]",
        link: "text-cyber-cyan underline-offset-4 hover:underline",
        // New cyber variant for high-emphasis actions
        cyber:
          "bg-cyber-neon text-black font-bold shadow-tactile-md hover:shadow-neon-glow hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-tactile-active",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
