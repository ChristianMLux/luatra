"use client";

import { useState } from "react";
import { useJobs } from "@/lib/hooks/useJobs";
import { JobCard } from "./JobCard";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { Skeleton } from "@repo/ui";
import Link from "next/link";
import { MasonryGrid } from "@repo/ui";

export default function JobDashboard() {
  const { jobs, loading } = useJobs();
  const [filter, setFilter] = useState<string>("all");

  const filteredJobs = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  if (loading) {
     return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[1,2,3,4,5,6].map(i => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
           ))}
        </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
            <p className="text-muted-foreground">Manage and track your job search progress.</p>
         </div>
         <Link href="/jobs/add">
            <Button>
               <Plus className="mr-2 h-4 w-4" /> New Application
            </Button>
         </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
         {["all", "Gespeichert", "Beworben", "Interview", "Angebot", "Abgelehnt"].map(status => (
            <Button 
               key={status} 
               variant={filter === status ? "default" : "outline"}
               size="sm"
               onClick={() => setFilter(status)}
               className="capitalize whitespace-nowrap"
            >
               {status}
               <span className="ml-2 text-xs opacity-70">
                  ({status === "all" ? jobs.length : jobs.filter(j => j.status === status).length})
               </span>
            </Button>
         ))}
      </div>

      {filteredJobs.length === 0 ? (
         <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
            <p className="text-muted-foreground">No jobs found.</p>
         </div>
      ) : (
        <MasonryGrid columnCount={3} gap={16}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onUpdate={() => {}} />
          ))}
        </MasonryGrid>
      )}
    </div>
  );
}
