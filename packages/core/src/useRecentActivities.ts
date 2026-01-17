"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import type { Activity, AppName } from "./activityTypes";

export interface UseRecentActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: Error | null;
}

/**
 * @hook useRecentActivities
 * @description Fetches recent activities from Firestore for the current user.
 * Real-time subscription updates when new activities are logged.
 * 
 * @param limitCount - Maximum number of activities to fetch (default: 10)
 * @param appFilter - Optional filter by app name
 */
export function useRecentActivities(
  limitCount: number = 10,
  appFilter?: AppName
): UseRecentActivitiesReturn {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Build query
    let activitiesQuery = query(
      collection(db, "activities"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    // Note: Firestore requires a composite index for multiple where clauses
    // For now, we filter app client-side to avoid index requirements

    const unsubscribe = onSnapshot(
      activitiesQuery,
      (snapshot) => {
        let docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];

        // Client-side app filter if specified
        if (appFilter) {
          docs = docs.filter((activity) => activity.app === appFilter);
        }

        setActivities(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching activities:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, limitCount, appFilter]);

  return { activities, loading, error };
}
