"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { useIsomorphicLayoutEffect } from 'framer-motion'; 

// Note: legacy used a custom hook, but framer-motion exports this too or we can just use useEffect for now if strict hydration match isn't critical, 
// but to be safe we'll use a simple implementation if not available.
// Actually, let's implement the hook inline or verify if we have it. 
// For now, I'll use standard useEffect to avoid missing dependency issues, or implement the hook.

interface MasonryGridProps {
  children: ReactNode[];
  columnCount?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columnCount = 3,
  gap = 24,
  className = "",
}: MasonryGridProps) {
  const [columns, setColumns] = useState<ReactNode[][]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  // Simple responsive logic matched from legacy
  const getResponsiveColumnCount = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return columnCount;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!children || !children.length) return;

    const responsiveColumnCount = getResponsiveColumnCount();

    // Create array of empty arrays
    const newColumns: ReactNode[][] = Array.from(
      { length: responsiveColumnCount },
      () => []
    );

    // Distribute children into columns
    children.forEach((child, index) => {
      const columnIndex = index % responsiveColumnCount;
      if (newColumns[columnIndex]) {
          newColumns[columnIndex].push(child);
      }
    });

    setColumns(newColumns);
  }, [children, columnCount, windowWidth]);

  if (!children || !children.length) {
    return null;
  }

  const currentCols = Math.min(3, getResponsiveColumnCount());

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${currentCols} ${className}`}
      style={{ 
        gap: `${gap}px`,
        // We might need to enforce grid-template-columns manually if Tailwind classes aren't generated for dynamic values
        gridTemplateColumns: `repeat(${currentCols}, minmax(0, 1fr))` 
      }}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column.map((item, itemIndex) => (
            <motion.div
              key={itemIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                delay: itemIndex * 0.05,
                ease: "easeOut",
              }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
