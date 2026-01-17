"use client";

import { Toaster as Sonner } from "sonner";

/**
 * @component Toaster
 * @description A glassmorphic, neon-accented toaster component using Sonner.
 * @author Joatra Agent
 * @maintenance-pledge Robust against minor layout shifts.
 */
type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark" // Default to dark for neon effect
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/60 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-neon-glow",
          description: "group-[.toaster]:text-muted-foreground",
          actionButton:
            "group-[.toaster]:bg-cyber-neon group-[.toaster]:text-black",
          cancelButton:
            "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground",
          error: "group-[.toaster]:border-cyber-pink/50 group-[.toaster]:text-cyber-pink",
          success: "group-[.toaster]:border-cyber-neon/50 group-[.toaster]:text-cyber-neon",
          warning: "group-[.toaster]:border-cyber-gold/50",
          info: "group-[.toaster]:border-cyber-cyan/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export { toast } from "sonner";
