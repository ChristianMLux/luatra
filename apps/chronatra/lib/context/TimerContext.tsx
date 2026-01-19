"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Timestamp, getDoc, doc } from "firebase/firestore";
import { useAuth, db } from "@repo/core"; // db is exported from core as well, or use local
import { TimerState, TimeEntry } from "../types";
import { addTimeEntry, stopTimeEntry, getRunningEntry } from "../services/timeEntryService";

export interface TimerContextType {
  timerState: TimerState;
  startTimer: (projectId?: string, description?: string, projectName?: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  updateDescription: (description: string) => void;
  formattedTime: string;
}

const defaultTimerState: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedMs: 0,
  activeEntryId: null,
  activeProjectId: null,
  activeDescription: "",
};

const TimerContext = createContext<TimerContextType>({
  timerState: defaultTimerState,
  startTimer: async () => {},
  stopTimer: async () => {},
  updateDescription: () => {},
  formattedTime: "00:00:00",
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [timerState, setTimerState] = useState<TimerState>(defaultTimerState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format elapsed time as HH:MM:SS
  const formattedTime = React.useMemo(() => {
    const totalSeconds = Math.floor(timerState.elapsedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timerState.elapsedMs]);

  // Check for running entry on mount
  useEffect(() => {
    if (!user) return;

    const checkRunningEntry = async () => {
      const runningEntry = await getRunningEntry(user.uid);
      if (runningEntry) {
        const startDate = runningEntry.startTime.toDate();
        const elapsed = Date.now() - startDate.getTime();
        let activeProjectName = undefined;
        if (runningEntry.projectId) {
          try {
            const pDoc = await getDoc(doc(db, "apps/chronatra/projects", runningEntry.projectId));
            if (pDoc.exists()) {
              activeProjectName = pDoc.data().name;
            }
          } catch (e) {
            console.error("Failed to fetch active project name on resume:", e);
          }
        }

        setTimerState({
          isRunning: true,
          startTime: startDate,
          elapsedMs: elapsed,
          activeEntryId: runningEntry.id || null,
          activeProjectId: runningEntry.projectId || null,
          activeProjectName,
          activeDescription: runningEntry.description || "",
        });
      }
    };

    checkRunningEntry();
  }, [user]);

  // Tick the timer when running
  useEffect(() => {
    if (timerState.isRunning && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - timerState.startTime!.getTime();
        setTimerState((prev) => ({ ...prev, elapsedMs: elapsed }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.startTime]);

  const startTimer = useCallback(
    async (projectId?: string, description?: string, projectName?: string) => {
      if (!user) return;

      const now = new Date();
      const entryId = await addTimeEntry(user.uid, {
        projectId,
        description: description || "",
        startTime: Timestamp.fromDate(now),
        isRunning: true,
      }, projectName);

      setTimerState({
        isRunning: true,
        startTime: now,
        elapsedMs: 0,
        activeEntryId: entryId,
        activeProjectId: projectId || null,
        activeProjectName: projectName || undefined,
        activeDescription: description || "",
      });
      // We could also store activeProjectName in state if we wanted to avoid refetching on stop
    },
    [user]
  );

  const stopTimer = useCallback(async () => {
    if (!user || !timerState.activeEntryId) return;

    const projectName = timerState.activeProjectName;

    await stopTimeEntry(
      user.uid, 
      timerState.activeEntryId, 
      timerState.elapsedMs, 
      timerState.activeDescription,
      projectName
    );

    setTimerState(defaultTimerState);
  }, [user, timerState.activeEntryId, timerState.elapsedMs, timerState.activeDescription, timerState.activeProjectName]);

  const updateDescription = useCallback((description: string) => {
    setTimerState((prev) => ({ ...prev, activeDescription: description }));
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timerState,
        startTimer,
        stopTimer,
        updateDescription,
        formattedTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);
