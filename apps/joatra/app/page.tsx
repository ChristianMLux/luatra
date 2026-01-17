"use client";

import { useAuth } from "@repo/core";
import JobDashboard from "@/components/jobs/JobDashboard";
import { Skeleton } from "@repo/ui";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Joatra
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-md">
            Career Trajectory & Application Management System
          </p>
          <div className="text-center text-muted-foreground mt-4">
            <p>Please log in via the Hub to access your dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <JobDashboard />
      </div>
    </main>
  );
}
