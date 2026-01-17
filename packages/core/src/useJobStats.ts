"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

/**
 * Job status types matching Joatra's German status values
 */
export type JobStatus = 'Gespeichert' | 'Beworben' | 'Interview' | 'Angebot' | 'Abgelehnt';

/**
 * Job stats grouped by status
 */
export interface JobStats {
  saved: number;      // Gespeichert
  applied: number;    // Beworben
  interview: number;  // Interview
  offer: number;      // Angebot
  rejected: number;   // Abgelehnt
  total: number;
}

/**
 * Hook return type
 */
export interface UseJobStatsReturn {
  stats: JobStats;
  loading: boolean;
  error: Error | null;
}

/**
 * @hook useJobStats
 * @description Fetches job application stats from Firestore for the current user.
 * Returns counts grouped by status for cross-app widget display in Hub.
 */
export function useJobStats(): UseJobStatsReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<JobStats>({
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setStats({ saved: 0, applied: 0, interview: 0, offer: 0, rejected: 0, total: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Real-time subscription to jobs collection
    const jobsQuery = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      jobsQuery,
      (snapshot) => {
        const statusCounts: Record<JobStatus, number> = {
          'Gespeichert': 0,
          'Beworben': 0,
          'Interview': 0,
          'Angebot': 0,
          'Abgelehnt': 0,
        };

        snapshot.docs.forEach((doc) => {
          const status = doc.data().status as JobStatus;
          if (status && status in statusCounts) {
            statusCounts[status]++;
          }
        });

        setStats({
          saved: statusCounts['Gespeichert'],
          applied: statusCounts['Beworben'],
          interview: statusCounts['Interview'],
          offer: statusCounts['Angebot'],
          rejected: statusCounts['Abgelehnt'],
          total: snapshot.docs.length,
        });
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching job stats:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { stats, loading, error };
}
