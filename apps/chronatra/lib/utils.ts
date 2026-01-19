import { Timestamp } from 'firebase/firestore';
import { formatDistanceStrict, format, differenceInSeconds } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Format milliseconds to HH:MM:SS display
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format milliseconds to a short form (e.g., "2h 15m")
 */
export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Calculate duration between two timestamps
 */
export function calculateDuration(start: Timestamp | Date, end: Timestamp | Date): number {
  const startDate = start instanceof Timestamp ? start.toDate() : start;
  const endDate = end instanceof Timestamp ? end.toDate() : end;
  return endDate.getTime() - startDate.getTime();
}

/**
 * Format a timestamp to a human-readable date
 */
export function formatDate(timestamp: Timestamp | Date, formatStr = 'dd.MM.yyyy'): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, formatStr, { locale: de });
}

/**
 * Format a timestamp to time only (HH:mm)
 */
export function formatTime(timestamp: Timestamp | Date): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, 'HH:mm', { locale: de });
}

/**
 * Get relative time (e.g., "vor 2 Stunden")
 */
export function getRelativeTime(timestamp: Timestamp | Date): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return formatDistanceStrict(date, new Date(), { locale: de, addSuffix: true });
}

/**
 * Calculate billable amount
 */
export function calculateBillableAmount(durationMs: number, hourlyRate: number): number {
  const hours = durationMs / (1000 * 60 * 60);
  return Math.round(hours * hourlyRate * 100) / 100; // Round to 2 decimal places
}

/**
 * Group entries by date key (YYYY-MM-DD)
 */
export function getDateKey(timestamp: Timestamp | Date): string {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, 'yyyy-MM-dd');
}
