"use client";

import { useId, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Button, Input, Modal } from "@repo/ui";
import { CHRONATRA_SUGGESTED_WORKDAY_MS } from "@repo/core";

interface StaleTimerDialogProps {
  startTime: Date;
  elapsedMs: number;
  onResolve: (endTime: Date) => Promise<void>;
}

const INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

/**
 * Shown when a timer has been running far longer than a workday. Instead of
 * stopping it with "now" (a fake 20+ hour entry), the user enters the real end.
 */
export function StaleTimerDialog({ startTime, elapsedMs, onResolve }: StaleTimerDialogProps) {
  const inputId = useId();
  // Frozen when the dialog opens so the allowed range doesn't move while typing.
  const [openedAt] = useState(() => new Date());
  const [value, setValue] = useState(() =>
    format(
      new Date(Math.min(startTime.getTime() + CHRONATRA_SUGGESTED_WORKDAY_MS, openedAt.getTime())),
      INPUT_FORMAT,
    ),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hoursRunning = Math.floor(elapsedMs / 3_600_000);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endTime = new Date(value);
    if (Number.isNaN(endTime.getTime()) || endTime <= startTime || endTime > new Date()) {
      setError(`Please pick a time between ${format(startTime, "dd.MM. HH:mm")} and now.`);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onResolve(endTime);
    } catch (e) {
      console.error("Failed to resolve stale timer:", e);
      setError("Saving failed. Please try again.");
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={() => {}}
      title={`Your timer has been running for ${hoursRunning} hours`}
      description="It was probably never stopped. When did you actually stop working?"
      size="sm"
      showCloseButton={false}
      closeOnEsc={false}
      closeOnBackdropClick={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-sm text-muted-foreground">
            Started {format(startTime, "dd.MM.yyyy 'at' HH:mm")}. Actual end:
          </label>
          <Input
            id={inputId}
            type="datetime-local"
            value={value}
            min={format(startTime, INPUT_FORMAT)}
            max={format(openedAt, INPUT_FORMAT)}
            onChange={(e) => setValue(e.target.value)}
            error={error !== null}
            aria-invalid={error !== null}
            autoFocus
            required
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Hint: your last commit or last message that day.
          </p>
        </div>
        <Button type="submit" disabled={saving} className="h-11">
          {saving ? "Saving..." : "Stop timer at this time"}
        </Button>
      </form>
    </Modal>
  );
}
