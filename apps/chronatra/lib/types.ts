import { Timestamp } from 'firebase/firestore';

/**
 * Firestore: /apps/chronatra/users/{uid}/timeEntries
 */
export interface TimeEntry {
  id?: string;
  userId: string;
  projectId?: string;
  description?: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;          // milliseconds, calculated on stop
  isRunning: boolean;
  tags?: string[];
  billable?: boolean;
  hourlyRate?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Firestore: /apps/chronatra/users/{uid}/projects
 */
export interface Project {
  id?: string;
  userId: string;
  name: string;
  client?: string;
  color?: string;             // Hex color for UI
  defaultHourlyRate?: number;
  isArchived?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Firestore: /apps/chronatra/users/{uid}/focusSessions
 */
export interface FocusSession {
  id?: string;
  userId: string;
  duration: number;           // target duration in ms
  actualDuration?: number;    // actual time spent
  completedAt: Timestamp;
  wasCompleted: boolean;      // true if user didn't cancel early
}

/**
 * Timer state for context
 */
export interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedMs: number;
  activeEntryId: string | null;
  activeProjectId: string | null;
  activeProjectName?: string;
  activeDescription: string;
}

/**
 * Status for display purposes
 */
export type TimerStatus = 'idle' | 'running' | 'paused';
