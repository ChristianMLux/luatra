"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@repo/core";
import { Card, Skeleton } from "@repo/ui";
import { Clock, Trash2 } from "lucide-react";
import { TimeEntry } from "@/lib/types";
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteTimeEntry } from "@/lib/services/timeEntryService";
import { formatDurationShort, formatDate, formatTime } from "@/lib/utils";

export function TimeEntryList() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({}); // Map id -> name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Fetch projects once
    const fetchProjectsMap = async () => {
      try {
        const qp = query(
          collection(db, "apps/chronatra/projects"), 
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(qp);
        const projectMap: Record<string, string> = {};
        snapshot.forEach(doc => {
           const data = doc.data();
           projectMap[doc.id] = data.name;
        });
        setProjects(projectMap);
      } catch (e) {
        console.error("Failed to fetch projects map:", e);
      }
    };
    
    fetchProjectsMap();
    
    // Create query
    const q = query(
      collection(db, "apps/chronatra/timeEntries"),
      where("userId", "==", user.uid),
      orderBy("startTime", "desc"),
      limit(20)
    );

    // Subscribe to updates
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newEntries: TimeEntry[] = [];
        snapshot.forEach((doc) => {
          newEntries.push({ id: doc.id, ...doc.data() } as TimeEntry);
        });
        // Filter out currently running entries (handled by TimerWidget)
        setEntries(newEntries.filter((e) => !e.isRunning));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to subscribe to time entries:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (entryId: string) => {
    try {
      await deleteTimeEntry(entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No time entries yet.</p>
        <p className="text-sm">Start the timer above to track your first session.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <TimeEntryCard
          key={entry.id}
          entry={entry}
          projectName={entry.projectId ? projects[entry.projectId] : undefined}
          onDelete={() => entry.id && handleDelete(entry.id)}
        />
      ))}
    </div>
  );
}

interface TimeEntryCardProps {
  entry: TimeEntry;
  projectName?: string;
  onDelete: () => void;
}

function TimeEntryCard({ entry, projectName, onDelete }: TimeEntryCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate flex items-center gap-2">
          <span>{entry.description || "No description"}</span>
          {projectName && (
            <span className="text-sm font-normal text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
              {projectName}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(entry.startTime)} • {formatTime(entry.startTime)}
          {entry.endTime && ` – ${formatTime(entry.endTime)}`}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-mono font-medium text-primary">
          {entry.duration ? formatDurationShort(entry.duration) : "—"}
        </span>
        <button
          onClick={onDelete}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
