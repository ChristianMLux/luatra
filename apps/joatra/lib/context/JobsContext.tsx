"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "@repo/core";
import { db } from "../firebase";
import { Job } from "../types";

export interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType>({
  jobs: [],
  loading: true,
  refreshJobs: () => {},
});

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to settle
    if (authLoading) return;

    let unsubscribe: () => void;

    if (user) {
      // Only set loading true if we don't have jobs yet (initial load)
      if (jobs.length === 0) setLoading(true);

      const q = query(
        collection(db, "jobs"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );



      unsubscribe = onSnapshot(
        q,
        (snapshot) => {

          const jobsData: Job[] = [];
          snapshot.forEach((doc) => {
            jobsData.push({ id: doc.id, ...doc.data() } as Job);
          });

          setJobs(jobsData);
          setLoading(false);
        },
        (error) => {
          console.error("JobsContext: Error loading jobs:", error);
          setLoading(false);
        }
      );
    } else {

      setJobs([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, authLoading]); // Depend on primitive UID to avoid loops from object reference changes

  const refreshJobs = () => {
    // Placeholder if we need manual refresh, but onSnapshot handles it.
  };

  return (
    <JobsContext.Provider value={{ jobs, loading: loading || authLoading, refreshJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobsContext = () => useContext(JobsContext);
