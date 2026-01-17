"use client";

import { useJobStats } from "@repo/core";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * @component JobPipelineWidget
 * @description Real-time job application pipeline widget showing stats from Joatra.
 * First cross-app widget in the Luatra ecosystem.
 */
export function JobPipelineWidget() {
  const { stats, loading, error } = useJobStats();

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-destructive" />
          <h3 className="text-sm font-medium">Application Pipeline</h3>
        </div>
        <p className="text-xs text-destructive">Failed to load job stats</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl group hover:border-cyber-neon/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="w-5 h-5 text-cyber-neon" />
          <h3 className="text-sm font-medium">Application Pipeline</h3>
        </div>
        <Link 
          href="http://localhost:3002" 
          className="text-[10px] font-mono text-muted-foreground hover:text-cyber-neon transition-colors"
        >
          JOATRA →
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-5 gap-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-glass-high p-3 rounded-lg">
              <div className="h-6 w-8 mx-auto bg-glass-medium rounded mb-1" />
              <div className="h-3 w-12 mx-auto bg-glass-medium rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {/* Saved */}
          <div className="bg-glass-high p-3 rounded-lg text-center hover:bg-glass-medium transition-colors">
            <div className="text-xl font-bold text-muted-foreground">{stats.saved}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Saved</div>
          </div>

          {/* Applied */}
          <div className="bg-glass-high p-3 rounded-lg text-center hover:bg-glass-medium transition-colors">
            <div className="text-xl font-bold text-cyber-cyan">{stats.applied}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Applied</div>
          </div>

          {/* Interview */}
          <div className="bg-glass-high p-3 rounded-lg text-center hover:bg-glass-medium transition-colors">
            <div className="text-xl font-bold text-yellow-500">{stats.interview}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Interview</div>
          </div>

          {/* Offer */}
          <div className="bg-glass-high p-3 rounded-lg text-center hover:bg-glass-medium transition-colors">
            <div className="text-xl font-bold text-green-500">{stats.offer}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Offer</div>
          </div>

          {/* Rejected */}
          <div className="bg-glass-high p-3 rounded-lg text-center hover:bg-glass-medium transition-colors">
            <div className="text-xl font-bold text-red-500">{stats.rejected}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Rejected</div>
          </div>
        </div>
      )}

      {/* Total Footer */}
      {!loading && (
        <div className="mt-4 pt-3 border-t border-glass-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Total Applications</span>
          <span className="text-sm font-mono text-cyber-neon">{stats.total}</span>
        </div>
      )}
    </div>
  );
}
