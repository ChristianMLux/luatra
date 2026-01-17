import React from "react";

export interface ToolRunnerProps {
  toolName: string;
  status: "idle" | "running" | "completed" | "failed";
}

export function ToolRunner({ toolName, status }: ToolRunnerProps) {
  return (
    <div className="tool-runner p-2 border rounded border-input bg-background/50">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{toolName}</span>
        <span className={`text-xs px-2 py-1 rounded ${
            status === 'running' ? 'bg-blue-500/20 text-blue-500' :
            status === 'completed' ? 'bg-green-500/20 text-green-500' :
            status === 'failed' ? 'bg-red-500/20 text-red-500' :
            'bg-gray-500/20 text-gray-500'
        }`}>
            {status}
        </span>
      </div>
    </div>
  );
}
