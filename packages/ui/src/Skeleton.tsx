"use client";

import { HTMLAttributes, useEffect } from "react";
import { cn } from "./utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  animation?: "pulse" | "shimmer" | "none";
  isLoading?: boolean;
}

const roundedClasses = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({
  className,
  width,
  height,
  rounded = "md",
  animation = "pulse",
  isLoading = true,
  children,
  style,
  ...props
}: SkeletonProps) {
  useEffect(() => {
    if (animation === "shimmer" && typeof window !== "undefined") {
      const styleId = "skeleton-shimmer-style";
      if (!document.getElementById(styleId)) {
        const styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.textContent = `
          @keyframes shimmer {
            0% { background-position: -500px 0; }
            100% { background-position: 500px 0; }
          }
          .animate-shimmer {
            background: linear-gradient(
              90deg, 
              rgba(255, 255, 255, 0.05), 
              rgba(255, 255, 255, 0.1), 
              rgba(255, 255, 255, 0.05)
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `;
        document.head.appendChild(styleEl);
      }
    }
  }, [animation]);

  const animationClass =
    animation === "pulse"
      ? "animate-pulse"
      : animation === "shimmer"
        ? "animate-shimmer"
        : "";

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-800/50",
        roundedClasses[rounded],
        animationClass,
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
