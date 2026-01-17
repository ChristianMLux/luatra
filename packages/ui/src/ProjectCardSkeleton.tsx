"use client";

import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";

interface ProjectCardSkeletonProps {
  tagsCount?: number;
  animate?: boolean;
}

export function ProjectCardSkeleton({
  tagsCount = 3,
  animate = true,
}: ProjectCardSkeletonProps) {
  const cardContent = (
    <div className="bg-glass-low border border-glass-border rounded-xl overflow-hidden shadow-md h-full">
      <div className="relative aspect-video">
        <Skeleton className="h-full w-full" rounded="none" />

        <div className="absolute top-4 right-4">
          <Skeleton className="w-16 h-5" rounded="full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <Skeleton className="h-7 w-3/4 mb-2" />

        {/* Description */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {Array.from({ length: tagsCount }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" rounded="full" />
          ))}
        </div>
      </div>
    </div>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {cardContent}
    </motion.div>
  );
}
