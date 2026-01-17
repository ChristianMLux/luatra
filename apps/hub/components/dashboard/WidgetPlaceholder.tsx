"use client";

import { ReactNode } from "react";
import { Card, Skeleton } from "@repo/ui";

interface WidgetPlaceholderProps {
  title: string;
  minHeight?: string;
  state?: "loading" | "empty" | "mock";
  children?: ReactNode;
}

export function WidgetPlaceholder({
  title,
  minHeight = "min-h-[200px]",
  state = "mock",
  children
}: WidgetPlaceholderProps) {
  return (
    <Card className={`bg-glass-low/50 border-dashed border-glass-border flex flex-col p-4 ${minHeight}`}>
      <div className="flex items-center justify-between mb-4 border-b border-glass-border pb-2">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <span className="text-[10px] bg-glass-high px-2 py-0.5 rounded text-muted-foreground">
          WIDGET
        </span>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center">
        {state === "loading" && (
          <div className="w-full space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}

        {state === "empty" && (
          <div className="text-center text-muted-foreground/50">
            <p className="text-xs">No Data Signal</p>
          </div>
        )}

        {state === "mock" && children}
      </div>
    </Card>
  );
}
