import * as React from "react";

import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as article (default), section, or div */
  as?: "article" | "section" | "div";
  /** Enable neon glow effect on hover */
  glow?: boolean;
}

/**
 * A glassmorphic card component with optional neon hover effects.
 * Uses semantic HTML elements for accessibility.
 */
function CardComponent(
  {
    className,
    as: Component = "article",
    glow = false,
    children,
    ...props
  }: CardProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(
        // Base: Glassmorphism with subtle border
        "bg-glass-low backdrop-blur-xl border border-glass-border rounded-xl p-6",
        // Transition for smooth hover effects
        "transition-all duration-300 ease-spring",
        // Hover: Neon border accent
        "hover:border-cyber-pink/50",
        // Optional glow effect
        glow && "hover:shadow-neon-glow",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

const Card = React.forwardRef(CardComponent) as React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLElement>
>;
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-2", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
