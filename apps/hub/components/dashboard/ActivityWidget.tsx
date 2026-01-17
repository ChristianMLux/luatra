"use client";

import { useRecentActivities, type Activity } from "@repo/core";
import { ClockIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

/**
 * App badge colors and labels
 */
const APP_CONFIG: Record<string, { color: string; label: string }> = {
  joatra: { color: "text-cyber-cyan", label: "Joatra" },
  finatra: { color: "text-cyber-neon", label: "Finatra" },
  hub: { color: "text-blue-400", label: "Hub" },
  system: { color: "text-muted-foreground", label: "System" },
};

/**
 * Format timestamp to relative time
 */
function formatTime(timestamp: { toDate: () => Date } | Date): string {
  try {
    const date = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "just now";
  }
}

/**
 * Single activity item
 */
function ActivityItem({ activity }: { activity: Activity }) {
  const appConfig = APP_CONFIG[activity.app] || APP_CONFIG.system;

  return (
    <li className="flex justify-between items-start gap-4 border-b border-glass-border pb-2 last:border-0">
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-mono ${appConfig?.color || 'text-muted-foreground'}`}>
          [{appConfig?.label || activity.app}]
        </span>
        <p className="text-xs text-foreground truncate mt-0.5">
          {activity.title}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        {formatTime(activity.createdAt)}
      </span>
    </li>
  );
}

/**
 * @component ActivityWidget
 * @description Real-time activity feed widget showing recent actions across all Luatra apps.
 */
export function ActivityWidget() {
  const { activities, loading, error } = useRecentActivities(8);

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5 text-destructive" />
          <h3 className="text-sm font-medium">Recent Activity</h3>
        </div>
        <p className="text-xs text-destructive">Failed to load activities</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl group hover:border-cyber-neon/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-cyber-neon" />
          <h3 className="text-sm font-medium">Recent Activity</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {loading ? "..." : `${activities.length} events`}
        </span>
      </div>

      {/* Activity List */}
      {loading ? (
        <ul className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="flex justify-between border-b border-glass-border pb-2">
              <div className="space-y-1">
                <div className="h-3 w-12 bg-glass-medium rounded" />
                <div className="h-3 w-32 bg-glass-medium rounded" />
              </div>
              <div className="h-3 w-16 bg-glass-medium rounded" />
            </li>
          ))}
        </ul>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground">No recent activity</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Actions in Joatra will appear here
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ul>
      )}
    </div>
  );
}
