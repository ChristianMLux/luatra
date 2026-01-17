"use client";

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { LogActivityParams, Activity } from "./activityTypes";

/**
 * @function logActivity
 * @description Logs an activity to Firestore for cross-app activity tracking.
 * Can be called from any app in the Luatra ecosystem.
 * 
 * @example
 * await logActivity({
 *   userId: user.uid,
 *   app: 'joatra',
 *   action: 'job_created',
 *   title: 'Created job at Google',
 *   metadata: { jobId: '123', company: 'Google' }
 * });
 */
export async function logActivity(
  userId: string,
  params: LogActivityParams
): Promise<string | null> {
  if (!userId) {
    console.warn("Cannot log activity: No user ID provided");
    return null;
  }

  try {
    const activity: Omit<Activity, "id"> = {
      userId,
      app: params.app,
      action: params.action,
      title: params.title,
      description: params.description,
      metadata: params.metadata,
      createdAt: Timestamp.now(),
    };

    // Remove undefined keys because Firestore throws error on undefined
    const cleanActivity = Object.fromEntries(
      Object.entries(activity).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, "activities"), cleanActivity);
    return docRef.id;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return null;
  }
}

/**
 * Helper functions for common activities
 */
export const ActivityLogger = {
  /**
   * Log a job-related activity
   */
  jobCreated: (userId: string, company: string, jobId?: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'job_created',
      title: `Created job at ${company}`,
      metadata: { jobId, company },
    }),

  jobUpdated: (userId: string, company: string, jobId?: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'job_updated',
      title: `Updated job at ${company}`,
      metadata: { jobId, company },
    }),

  jobDeleted: (userId: string, company: string, jobId?: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'job_deleted',
      title: `Deleted job at ${company}`,
      metadata: { jobId, company },
    }),

  jobStatusChanged: (userId: string, company: string, newStatus: string, jobId?: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'job_status_changed',
      title: `${company}: Status → ${newStatus}`,
      metadata: { jobId, company, newStatus },
    }),

  profileUpdated: (userId: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'profile_updated',
      title: 'Updated profile',
    }),

  cvGenerated: (userId: string, company?: string) =>
    logActivity(userId, {
      app: 'joatra',
      action: 'cv_generated',
      title: company ? `Generated CV for ${company}` : 'Generated CV',
      metadata: { company },
    }),
};
