import {
  endOfDay,
  endOfMonth,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";

export type RangeKey = "week" | "month" | "lastMonth" | "3months" | "6months" | "year" | "custom";

export const RANGE_LABELS: Record<RangeKey, string> = {
  week: "Last 7 Days",
  month: "This Month",
  lastMonth: "Last Month",
  "3months": "Last 3 Months",
  "6months": "Last 6 Months",
  year: "This Year",
  custom: "Custom Range",
};

export const DATE_INPUT_FORMAT = "yyyy-MM-dd";

/** Resolves a range choice to concrete dates; null when a custom range is incomplete or inverted. */
export function resolveRange(
  range: RangeKey,
  customFrom: string,
  customTo: string,
  now: Date,
): { start: Date; end: Date } | null {
  switch (range) {
    case "week":
      return { start: startOfDay(subDays(now, 7)), end: now };
    case "month":
      return { start: startOfMonth(now), end: now };
    case "lastMonth": {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
    case "3months":
      return { start: startOfDay(subMonths(now, 3)), end: now };
    case "6months":
      return { start: startOfDay(subMonths(now, 6)), end: now };
    case "year":
      return { start: startOfYear(now), end: now };
    case "custom": {
      const from = parseISO(customFrom);
      const to = parseISO(customTo);
      if (!isValid(from) || !isValid(to) || from > to) return null;
      return { start: startOfDay(from), end: endOfDay(to) };
    }
  }
}
