"use client";

import { useState, useEffect, useMemo, useId } from "react";
import { format, startOfMonth, subMonths } from "date-fns";
import { useAuth } from "@repo/core";
import { Card, Input, Skeleton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@repo/ui";
import { FileBarChart } from "lucide-react";
import { getProjects } from "@/lib/services/projectService";
import { getTimeEntriesByDateRange } from "@/lib/services/timeEntryService";
import { Project, TimeEntry } from "@/lib/types";
import dynamic from "next/dynamic";
import TimesheetPDF from "@/components/reports/TimesheetPDF";
import { DATE_INPUT_FORMAT, RANGE_LABELS, resolveRange, type RangeKey } from "@/lib/reportRange";
import { WEEKLY_TARGET_HOURS, formatWeekDiff, hoursAboveTarget, summarizeWeeks } from "@/lib/reportStats";

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
  const [range, setRange] = useState<RangeKey>("month");
  const [customFrom, setCustomFrom] = useState(() =>
    format(startOfMonth(subMonths(new Date(), 1)), DATE_INPUT_FORMAT),
  );
  const [customTo, setCustomTo] = useState(() => format(new Date(), DATE_INPUT_FORMAT));
  const [projectFilter, setProjectFilter] = useState("all");
  const fromId = useId();
  const toId = useId();

  const period = useMemo(
    () => resolveRange(range, customFrom, customTo, new Date()),
    [range, customFrom, customTo],
  );
  const periodStartMs = period?.start.getTime();
  const periodEndMs = period?.end.getTime();

  // Projects don't depend on the period, so they are fetched once per user.
  useEffect(() => {
    if (!user) return;
    getProjects(user.uid)
      .then(setProjects)
      .catch((error) => console.error("Error loading projects:", error));
  }, [user]);

  useEffect(() => {
    if (!user || periodStartMs === undefined || periodEndMs === undefined) {
      setEntries([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getTimeEntriesByDateRange(user.uid, new Date(periodStartMs), new Date(periodEndMs))
      .then((entriesData) => {
        // Running entries have no final duration yet, so they stay out of reports.
        if (!cancelled) setEntries(entriesData.filter((e) => !e.isRunning));
      })
      .catch((error) => console.error("Error loading report data:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, periodStartMs, periodEndMs]);

  // The project filter applies to the list, the totals and the PDF alike.
  const visibleEntries = useMemo(
    () => entries.filter((e) => projectFilter === "all" || e.projectId === projectFilter),
    [entries, projectFilter],
  );
  const projectsById = useMemo(
    () => new Map(projects.map((p) => [p.id, p])),
    [projects],
  );
  const totalHours = useMemo(
    () => visibleEntries.reduce((acc, e) => acc + (e.duration || 0), 0) / 3600000,
    [visibleEntries],
  );
  const weeks = useMemo(
    () => (period ? summarizeWeeks(visibleEntries, period) : []),
    [visibleEntries, period],
  );

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

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Reports</h1>

          <div className="flex flex-wrap gap-4 items-center">
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
              onValueChange={(value) => setRange(value as RangeKey)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
                  <SelectItem key={key} value={key}>{RANGE_LABELS[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {visibleEntries.length > 0 && period && (
              <PDFDownloadLink
                document={
                  <TimesheetPDF
                    entries={visibleEntries}
                    projects={projects}
                    startDate={period.start}
                    endDate={period.end}
                    userName={user.email || 'User'}
                  />
                }
                fileName={`timesheet-${format(period.start, DATE_INPUT_FORMAT)}_${format(period.end, DATE_INPUT_FORMAT)}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? "Generating..." : "Export PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </header>

        {range === "custom" && (
          <fieldset className="flex flex-wrap gap-4 items-end mb-6">
            <legend className="sr-only">Custom report period</legend>
            <div className="flex flex-col gap-1">
              <label htmlFor={fromId} className="text-sm text-muted-foreground">From</label>
              <Input
                id={fromId}
                type="date"
                value={customFrom}
                max={customTo}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={toId} className="text-sm text-muted-foreground">To</label>
              <Input
                id={toId}
                type="date"
                value={customTo}
                min={customFrom}
                max={format(new Date(), DATE_INPUT_FORMAT)}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
            {!period && (
              <p role="alert" className="text-sm text-destructive">
                The start date must be on or before the end date.
              </p>
            )}
          </fieldset>
        )}

        {visibleEntries.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <FileBarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p>No tracked time in this period.</p>
          </Card>
        ) : (
          <div className="space-y-4">
             {/* Simple Stats Summary */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Card className="p-4">
                 <div className="text-sm text-muted-foreground">Total Entries</div>
                 <div className="text-2xl font-bold">{visibleEntries.length}</div>
               </Card>
               <Card className="p-4">
                 <div className="text-sm text-muted-foreground">Total Hours</div>
                 <div className="text-2xl font-bold">
                   {totalHours.toFixed(1)}h
                 </div>
               </Card>
               <Card className="p-4">
                 <div className="text-sm text-muted-foreground">Above {WEEKLY_TARGET_HOURS} h/week</div>
                 <div className="text-2xl font-bold">
                   {hoursAboveTarget(weeks).toFixed(1)}h
                 </div>
               </Card>
             </div>

             <section aria-labelledby="weekly-overview-heading">
               <Card className="p-4">
                 <h2 id="weekly-overview-heading" className="text-sm font-medium text-muted-foreground mb-3">
                   Weekly overview (target {WEEKLY_TARGET_HOURS} h)
                 </h2>
                 <table className="w-full text-sm">
                   <thead className="sr-only">
                     <tr>
                       <th scope="col">Week</th>
                       <th scope="col">Hours</th>
                       <th scope="col">Difference to target</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {weeks.map((week) => (
                       <tr key={week.weekStart.getTime()}>
                         <td className="py-2">{week.label}</td>
                         <td className="py-2 text-right font-mono">{(week.totalMs / 3600000).toFixed(1)}h</td>
                         <td
                           className={`py-2 text-right font-mono ${
                             week.diffHours > 0 ? "text-destructive" : "text-muted-foreground"
                           }`}
                         >
                           {formatWeekDiff(week)}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
             </section>

             {/* List View */}
              <Card className="divide-y divide-border">
                 {visibleEntries.map(entry => {
                    const project = entry.projectId ? projectsById.get(entry.projectId) : undefined;
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
