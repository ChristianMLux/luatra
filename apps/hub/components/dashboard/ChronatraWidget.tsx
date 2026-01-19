"use client";

import { useAuth, useChronatraStats } from "@repo/core";
import { ClockIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/outline";

// Duration formatter including seconds
function formatTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 60000) % 60);
  const hours = Math.floor(ms / 3600000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (hours === 0) return `${pad(minutes)}:${pad(seconds)}`;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

// Direct Firestore update to stop timer since we can't easily import app-specific service
import { doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { db, ChronatraLogger } from "@repo/core";
import { useState } from "react";

export function ChronatraWidget() {
  const { user } = useAuth();
  const stats = useChronatraStats(user?.uid);
  const [stopping, setStopping] = useState(false);

  // Calculate duration string for active timer
  const activeDuration = stats.activeEntryStartTime 
    ? formatTime(Date.now() - stats.activeEntryStartTime) 
    : "0m";

  const handleStop = async () => {
    if (!user || !stats.activeEntryId || !stats.activeEntryStartTime) return;
    
    setStopping(true);
    try {
      const durationMs = Date.now() - stats.activeEntryStartTime;
      const entryRef = doc(db, "apps/chronatra/timeEntries", stats.activeEntryId);

      await updateDoc(entryRef, {
        endTime: Timestamp.now(),
        duration: durationMs,
        isRunning: false,
        updatedAt: serverTimestamp(),
      });

      await ChronatraLogger.timerStopped(
        user.uid, 
        durationMs, 
        stats.activeEntryId,
        stats.activeEntryDescription,
        stats.activeProjectName
      );
    } catch (error) {
      console.error("Failed to stop timer from Hub:", error);
    } finally {
      setStopping(false);
    }
  };

  return (
    <div className="bg-glass-medium border border-glass-border rounded-xl p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden group hover:border-cyber-neon/50 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-start z-10 w-full">
        <div>
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-cyber-neon" />
            Time Intelligence
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.loading ? "Syncing..." : "This Week"}
          </p>
        </div>
        {stats.activeTimer ? (
          <button 
            onClick={handleStop}
            disabled={stopping}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-neon/10 border border-cyber-neon/20 hover:bg-destructive/20 hover:border-destructive/30 hover:text-destructive group/stop transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neon group-hover/stop:bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-neon group-hover/stop:bg-destructive"></span>
            </span>
            <span className="text-xs font-mono font-bold text-cyber-neon group-hover/stop:text-destructive">
              {stopping ? "STOPPING..." : "STOP"}
            </span>
          </button>
        ) : (
           <div className="px-3 py-1 rounded-full bg-glass-low border border-glass-border text-xs text-muted-foreground">
             Idle
           </div>
        )}
      </div>

      {/* Stats */}
      <div className="z-10 mt-4 space-y-4">
        {stats.activeTimer ? (
          <div className="p-3 bg-glass-low rounded-lg border border-glass-border animate-in fade-in">
             <div className="text-xs text-muted-foreground mb-1">Current Session</div>
              <div className="text-xl font-mono font-bold text-foreground truncate">
                {stats.activeEntryDescription || "No Description"}
              </div>
              {stats.activeProjectName && (
                <div className="text-xs text-cyber-neon/80 font-medium truncate mt-0.5">
                  {stats.activeProjectName}
                </div>
              )}
             <div className="text-sm text-cyber-neon font-mono mt-1">
               {activeDuration} elapsed
             </div>
          </div>
        ) : (
          <div>
             <div className="text-3xl font-mono font-bold text-foreground">
               {stats.loading ? "..." : formatTime(stats.weekTotal)}
             </div>
             <p className="text-xs text-muted-foreground">Total Time Tracked</p>
          </div>
        )}

        {stats.todayTotal > 0 && !stats.activeTimer && (
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Today: <span className="text-foreground font-medium">{formatTime(stats.todayTotal)}</span></span>
           </div>
        )}
      </div>

      {/* Decorative Background */}
      <div className="absolute -bottom-6 -right-6 text-cyber-neon/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
        <ClockIcon className="w-40 h-40" />
      </div>
    </div>
  );
}
