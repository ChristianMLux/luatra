"use client";

import { Suspense } from "react";
import { CVWizard } from "@/components/cv/CVWizard";
import { Skeleton } from "@repo/ui";

export default function CVGeneratorPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <CVWizard />
    </Suspense>
  );
}
