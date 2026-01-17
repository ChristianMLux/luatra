"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "./utils";

/**
 * @component ScrollProgress
 * @description A scroll progress indicator with cyber-noir styling.
 * Shows an orange progress bar at the top of the page.
 */
export interface ScrollProgressProps {
  alwaysVisible?: boolean;
  height?: number;
  className?: string;
  zIndex?: number;
}

export function ScrollProgress({
  alwaysVisible = false,
  height = 3,
  className = "",
  zIndex = 60,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(alwaysVisible);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (alwaysVisible) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  if (!isVisible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(scrollYProgress.get() * 100)}
      className="fixed top-0 left-0 right-0"
      style={{ height: `${height}px`, zIndex }}
    >
      <motion.div
        className={cn(
          "h-full origin-left bg-cyber-neon",
          "shadow-[0_0_10px_rgba(255,127,64,0.5)]",
          className,
        )}
        style={{ scaleX }}
      />
    </div>
  );
}
