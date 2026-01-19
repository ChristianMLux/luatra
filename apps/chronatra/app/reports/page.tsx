"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@repo/core";
import { Card, Skeleton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@repo/ui";
import { FileBarChart } from "lucide-react";
import { getProjects } from "@/lib/services/projectService";
import { getTimeEntriesByDateRange } from "@/lib/services/timeEntryService";
import { Project, TimeEntry } from "@/lib/types";
import dynamic from "next/dynamic";
import TimesheetPDF from "@/components/reports/TimesheetPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <Button disabled>Loading PDF...</Button>,
  }
);

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month"); // 'month' | 'week'
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch Projects
        const projectsData = await getProjects(user.uid);
        setProjects(projectsData);

        // Calculate Date Range
        const now = new Date();
        const startDate = new Date();
        if (range === "month") {
          startDate.setMonth(now.getMonth(), 1); // Start of month
        } else {
          startDate.setDate(now.getDate() - 7); // Last 7 days
        }
        startDate.setHours(0, 0, 0, 0);

        // Fetch Entries
        const entriesData = await getTimeEntriesByDateRange(user.uid, startDate, now);
        // Filter out running entries for report
        const filtered = entriesData.filter(e => !e.isRunning);
        setEntries(filtered);
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, range]);

  if (authLoading || (loading && !entries.length)) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
          <p className="text-muted-foreground">Please log in to view reports.</p>
        </div>
      </main>
    );
  }

  const rangeLabels = {
    month: "This Month",
    week: "Last 7 Days",
  };

  const getStartDate = () => {
     const now = new Date();
     if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
     const d = new Date();
     d.setDate(d.getDate() - 7);
     return d;
  };

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          
          <div className="flex gap-4 items-center">
            <Select 
              value={projectFilter} 
              onValueChange={setProjectFilter}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id ?? "unknown"} value={p.id || "unknown"}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={range} 
              onValueChange={setRange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>

            {entries.length > 0 && (
              <PDFDownloadLink
                document={
                  <TimesheetPDF 
                    entries={entries} 
                    projects={projects} 
                    startDate={getStartDate()} 
                    endDate={new Date()}
                    userName={user.email || 'User'} 
                  />
                }
                fileName={`timesheet-${range}.pdf`}
              >
                {/* @ts-ignore */}
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? "Generating..." : "Export PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <FileBarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p>Track some time to generate reports.</p>
          </Card>
        ) : (
          <div className="space-y-4">
             {/* Simple Stats Summary */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Card className="p-4">
                 <div className="text-sm text-muted-foreground">Total Entries</div>
                 <div className="text-2xl font-bold">{entries.length}</div>
               </Card>
               <Card className="p-4">
                 <div className="text-sm text-muted-foreground">Total Hours</div>
                 <div className="text-2xl font-bold">
                   {(entries.reduce((acc, e) => acc + (e.duration || 0), 0) / 3600000).toFixed(1)}h
                 </div>
               </Card>
             </div>
             
             {/* List View */}
              <Card className="divide-y divide-border">
                 {entries
                   .filter(e => projectFilter === 'all' || e.projectId === projectFilter)
                   .map(entry => {
                    const project = projects.find(p => p.id === entry.projectId);
                    return (
                      <div key={entry.id} className="p-4 flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium text-foreground">{project?.name || "No Project"}</div>
                          <div className="text-muted-foreground">{entry.description || "No description"}</div>
                        </div>
                        <div className="font-mono">
                          {((entry.duration || 0) / 60000).toFixed(0)}m
                        </div>
                      </div>
                    );
                 })}
              </Card>
          </div>
        )}
      </div>
    </main>
  );
}
