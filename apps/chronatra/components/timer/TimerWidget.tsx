"use client";

import { useState, useEffect } from "react";
import { Button, Card, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Play, Square, Clock } from "lucide-react";
import { useAuth } from "@repo/core";
import { useTimer } from "@/lib/context/TimerContext";
import { getProjects } from "@/lib/services/projectService";
import { Project } from "@/lib/types";

export function TimerWidget() {
  const { timerState, startTimer, stopTimer, formattedTime, updateDescription } = useTimer();
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        const data = await getProjects(user.uid);
        // Filter out archived projects
        setProjects(data.filter(p => !p.isArchived));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    fetchProjects();
  }, [user]);

  // Sync internal state with timer state when running
  useEffect(() => {
    if (timerState.isRunning && timerState.activeProjectId) {
      setSelectedProjectId(timerState.activeProjectId);
    } else if (timerState.isRunning && !timerState.activeProjectId) {
       setSelectedProjectId("no_project");
    }
  }, [timerState.isRunning, timerState.activeProjectId]);

  const handleStart = async () => {
    const activeProject = (selectedProjectId === "no_project" || selectedProjectId === "unknown") ? "" : selectedProjectId;
    const selectedProject = projects.find(p => p.id === activeProject);
    await startTimer(activeProject || undefined, description, selectedProject?.name);
  };

  const handleStop = async () => {
    await stopTimer();
    setDescription("");
    // We intentionally keep the selected project for the next timer
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Timer Display */}
        <div className="flex items-center justify-center gap-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
          <span className="text-5xl font-mono font-bold tabular-nums">
            {formattedTime}
          </span>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          {/* Description Input (2/3 width) */}
          <div className="w-2/3">
            <Input
              placeholder="What are you working on?"
              value={timerState.isRunning ? timerState.activeDescription : description}
              onChange={(e) => {
                if (timerState.isRunning) {
                  updateDescription(e.target.value);
                } else {
                  setDescription(e.target.value);
                }
              }}
              // Allow editing description while running, but maybe separate concerns?
              // The requirement didn't specify locking, but context allows updateDescription.
              // We'll keep it editable as per previous implementation logic.
            />
          </div>

          {/* Project Select (1/3 width) */}
          <div className="w-1/3">
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="No Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_project">No Project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id ?? "unknown"} value={p.id || "unknown"}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Start/Stop Button */}
        <div className="flex justify-center">
          {timerState.isRunning ? (
            <Button
              onClick={handleStop}
              variant="destructive"
              size="lg"
              className="gap-2 min-w-[140px]"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              variant="default"
              size="lg"
              className="gap-2 min-w-[140px]"
            >
              <Play className="w-5 h-5" />
              Start
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
