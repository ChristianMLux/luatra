import { addDays, endOfDay, format, getISOWeek, startOfISOWeek } from "date-fns";
import type { TimeEntry } from "./types";

/** Contractual weekly hours the weekly overview compares against. */
export const WEEKLY_TARGET_HOURS = 40;

const HOUR_MS = 3_600_000;

export interface WeekSummary {
  weekStart: Date;
  /** e.g. "W38 · 14.09.–20.09.2026" */
  label: string;
  totalMs: number;
  /** Hours worked minus the weekly target; negative when under target. */
  diffHours: number;
  /** The week is cut off by the report period (or still running). */
  partial: boolean;
}

/** Firestore Timestamps and plain dates both occur in entries. */
export function entryDate(value: TimeEntry["startTime"] | undefined): Date | null {
  if (!value) return null;
  const maybeTimestamp = value as { toDate?: () => Date };
  return typeof maybeTimestamp.toDate === "function"
    ? maybeTimestamp.toDate()
    : new Date(value as unknown as string);
}

/**
 * Groups entries by ISO week (Monday start) in one pass and compares each
 * week with the target. Weeks that extend past the period are flagged partial.
 */
export function summarizeWeeks(
  entries: TimeEntry[],
  period: { start: Date; end: Date },
): WeekSummary[] {
  const totals = new Map<number, number>();
  for (const entry of entries) {
    const start = entryDate(entry.startTime);
    if (!start) continue;
    const key = startOfISOWeek(start).getTime();
    totals.set(key, (totals.get(key) ?? 0) + (entry.duration ?? 0));
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a - b)
    .map(([key, totalMs]) => {
      const weekStart = new Date(key);
      const weekEnd = endOfDay(addDays(weekStart, 6));
      return {
        weekStart,
        label: `W${getISOWeek(weekStart)} · ${format(weekStart, "dd.MM.")}–${format(weekEnd, "dd.MM.yyyy")}`,
        totalMs,
        diffHours: totalMs / HOUR_MS - WEEKLY_TARGET_HOURS,
        partial: weekStart < period.start || weekEnd > period.end,
      };
    });
}

/** Sum of hours above the weekly target; weeks under target don't offset it. */
export function hoursAboveTarget(weeks: WeekSummary[]): number {
  return weeks.reduce((acc, week) => acc + Math.max(0, week.diffHours), 0);
}

/** "+3.5 h", "-2.0 h", or "partial week" when a shortfall isn't meaningful. */
export function formatWeekDiff(week: WeekSummary): string {
  if (week.partial && week.diffHours < 0) return "partial week";
  // ASCII hyphen: the PDF's standard Helvetica has no U+2212 and drops it silently.
  const sign = week.diffHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(week.diffHours).toFixed(1)} h`;
}
