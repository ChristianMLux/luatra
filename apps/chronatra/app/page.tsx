"use client";

import { useAuth } from "@repo/core";
import { Skeleton } from "@repo/ui";
import { TimerWidget } from "@/components/timer/TimerWidget";
import { TimeEntryList } from "@/components/entries/TimeEntryList";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-48 w-full mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
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
            Chronatra
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-md">
            Time Intelligence & Work-Life Balance
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Time Tracker</h1>
        
        {/* Timer Widget */}
        <div className="mb-8">
          <TimerWidget />
        </div>

        {/* Recent Entries */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <TimeEntryList />
        </section>
      </div>
    </main>
  );
}
