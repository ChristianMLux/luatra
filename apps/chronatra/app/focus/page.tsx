"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@repo/core";
import { Card, Button, Skeleton } from "@repo/ui";
import { Focus, Play, Pause, RotateCcw } from "lucide-react";

const FOCUS_DURATION = 25 * 60 * 1000; // 25 minutes in ms
const BREAK_DURATION = 5 * 60 * 1000;  // 5 minutes in ms

type FocusState = "idle" | "focus" | "break";

export default function FocusPage() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<FocusState>("idle");
  const [remainingMs, setRemainingMs] = useState(FOCUS_DURATION);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (state === "idle") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          // Timer finished
          if (state === "focus") {
            setState("break");
            return BREAK_DURATION;
          } else {
            setState("idle");
            return FOCUS_DURATION;
          }
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  const handleStart = () => {
    setState("focus");
    setRemainingMs(FOCUS_DURATION);
  };

  const handlePause = () => {
    setState("idle");
  };

  const handleReset = () => {
    setState("idle");
    setRemainingMs(FOCUS_DURATION);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-10 w-48 mb-6 mx-auto" />
          <Skeleton className="h-80 w-full rounded-full" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
          <p className="text-muted-foreground">Please log in to use Focus Mode.</p>
        </div>
      </main>
    );
  }

  const progress = state === "focus" 
    ? (FOCUS_DURATION - remainingMs) / FOCUS_DURATION 
    : state === "break"
    ? (BREAK_DURATION - remainingMs) / BREAK_DURATION
    : 0;

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Focus Mode</h1>
        <p className="text-muted-foreground mb-8">
          {state === "idle" && "Ready to focus?"}
          {state === "focus" && "Stay focused! No distractions."}
          {state === "break" && "Take a short break!"}
        </p>

        {/* Timer Circle */}
        <Card className="p-8 mb-8">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              {/* Progress Circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
                className={state === "break" ? "text-green-500" : "text-primary"}
              />
            </svg>
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Focus className={`w-8 h-8 mb-2 ${state === "focus" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-5xl font-mono font-bold">{formatTime(remainingMs)}</span>
              <span className="text-sm text-muted-foreground mt-2 capitalize">
                {state === "idle" ? "Ready" : state}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {state === "idle" ? (
              <Button onClick={handleStart} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Start Focus
              </Button>
            ) : (
              <>
                <Button onClick={handlePause} variant="secondary" size="lg" className="gap-2">
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </Card>

        <p className="text-sm text-muted-foreground">
          25 minutes focus, 5 minutes break. Repeat.
        </p>
      </div>
    </main>
  );
}
