"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChronatraStats {
  todayTotal: number;       // milliseconds tracked today
  weekTotal: number;        // milliseconds tracked this week
  activeTimer: boolean;     // is a timer currently running
  activeEntryId?: string;
  activeEntryDescription?: string;
  activeEntryStartTime?: number;
  activeProjectName?: string;
  loading: boolean;
}

/**
 * Hook for Hub widget to display Chronatra stats
 */
export function useChronatraStats(userId: string | undefined): ChronatraStats {
  const [stats, setStats] = useState<ChronatraStats>({
    todayTotal: 0,
    weekTotal: 0,
    activeTimer: false,
    loading: true,
  });

  const activeProjectNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!userId) {
      setStats((prev) => ({ ...prev, loading: false }));
      return;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

    let unsubscribeSnapshot: () => void;
    
    // Store latest snapshot data for the interval to use
    let currentDocs: any[] = [];

    const q = query(
      collection(db, "apps/chronatra/timeEntries"),
      where("userId", "==", userId),
      where("startTime", ">=", Timestamp.fromDate(startOfWeek)),
      orderBy("startTime", "desc"),
      limit(100)
    );



    const calculateStats = (projectName?: string) => {
      let todayTotal = 0;
      let weekTotal = 0;
      let activeTimer = false;
      let activeEntryId = undefined;
      let activeEntryDescription = undefined;
      let activeEntryStartTime = undefined;
      
      // Update ref if new name provided
      if (projectName !== undefined) {
        activeProjectNameRef.current = projectName;
      }
      // Use ref value (persist across interval ticks)
      const activeProjectName = activeProjectNameRef.current;

      const now = Date.now();

      currentDocs.forEach((docData) => {
        const startTime = (docData.startTime as Timestamp).toDate();

        if (docData.isRunning) {
          activeTimer = true;
          activeEntryId = docData.id; 
          activeEntryDescription = docData.description;
          activeEntryStartTime = startTime.getTime();

          // Add elapsed time for running timer
          const elapsed = now - startTime.getTime();
          if (startTime >= startOfDay) {
            todayTotal += elapsed;
          }
          weekTotal += elapsed;
        } else if (docData.duration) {
          if (startTime >= startOfDay) {
            todayTotal += docData.duration;
          }
          weekTotal += docData.duration;
        }
      });

      setStats({
        todayTotal,
        weekTotal,
        activeTimer,
        activeEntryId,
        activeEntryDescription,
        activeEntryStartTime,
        activeProjectName,
        loading: false,
      });
    };

    // 1. Listen to Firestore updates
    unsubscribeSnapshot = onSnapshot(
      q,
      async (snapshot) => {
        // Map docs with ID
        currentDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })); 
        
        // If there's an active timer, we might need to fetch the project name
        // We can do this by checking the active doc
        const activeDoc = currentDocs.find(d => d.isRunning);
        let activeProjectName = undefined;
        
        if (activeDoc && activeDoc.projectId) {
           try {
             const { getDoc, doc } = await import("firebase/firestore");
             // We need to access db here. Since this is inside useEffect, we can use the imported db
             const pDoc = await getDoc(doc(db, "apps/chronatra/projects", activeDoc.projectId));
             if (pDoc.exists()) {
               activeProjectName = pDoc.data().name;
             }
           } catch(e) {
             console.error("Failed to fetch active project:", e);
           }
        }
        
        calculateStats(activeProjectName); // Pass project name to calculate
      },
      (error) => {
        console.error("Error fetching Chronatra stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    );

    // 2. Set up interval for live updates (every second to show ticking timer)
    const intervalId = setInterval(() => {
      // Check if any doc is running in our current cached docs
      const activeDoc = currentDocs.find(d => d.isRunning);
      if (activeDoc) {
        // We need to persist the project name in the interval updates too.
        // Ideally we store it in a ref or state outside calculateStats, but simpler is to
        // make calculateStats read from a closure variable or state.
        // Actually, we can just let the interval reuse the last known activeProjectName from state? 
        // No, calculateStats is defined inside useEffect.
        // Let's refactor calculateStats to accept project name or store it in a ref.
      }
       // simpler: just re-run calc. The project name won't change every second.
       // We need to store activeProjectName in a ref to reuse it in interval.
       calculateStats(activeProjectNameRef.current);
    }, 1000); 

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      clearInterval(intervalId);
    };
  }, [userId]);



  return stats;
}
