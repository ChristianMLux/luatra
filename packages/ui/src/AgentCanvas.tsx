import React from "react";

export interface AgentCanvasProps {
  children?: React.ReactNode;
}

export function AgentCanvas({ children }: AgentCanvasProps) {
  return (
    <div className="agent-canvas border border-border p-4 rounded-lg bg-card text-card-foreground">
      <h2 className="text-xl font-bold mb-4">Agent Canvas</h2>
      <div className="canvas-content min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
