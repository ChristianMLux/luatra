import { Timestamp } from "firebase/firestore";

/**
 * Available app names in the Luatra ecosystem
 */
export type AppName = 'joatra' | 'finatra' | 'hub' | 'system';

/**
 * Activity record stored in Firestore
 */
export interface Activity {
  id?: string;
  userId: string;
  app: AppName;
  action: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp;
}

/**
 * Parameters for logging an activity
 */
export interface LogActivityParams {
  app: AppName;
  action: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Predefined action types for consistency
 */
export const ActivityActions = {
  // Joatra actions
  JOB_CREATED: 'job_created',
  JOB_UPDATED: 'job_updated',
  JOB_DELETED: 'job_deleted',
  JOB_STATUS_CHANGED: 'job_status_changed',
  PROFILE_UPDATED: 'profile_updated',
  CV_GENERATED: 'cv_generated',
  COVER_LETTER_GENERATED: 'cover_letter_generated',
  
  // Finatra actions (future)
  EXPENSE_ADDED: 'expense_added',
  INCOME_ADDED: 'income_added',
  BUDGET_UPDATED: 'budget_updated',
  
  // System actions
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  BACKUP_COMPLETED: 'backup_completed',
} as const;

export type ActivityAction = typeof ActivityActions[keyof typeof ActivityActions];
