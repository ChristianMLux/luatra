/**
 * A timer running longer than this was almost certainly left on by accident
 * (laptop closed, browser tab forgotten). Stopping it with "now" would record
 * a fake 20+ hour day, so both Chronatra and the Hub ask for the real end instead.
 */
export const CHRONATRA_STALE_TIMER_MS = 14 * 60 * 60 * 1000;

/** End time suggested for a stale timer: one regular workday after the start. */
export const CHRONATRA_SUGGESTED_WORKDAY_MS = 8 * 60 * 60 * 1000;

export function isStaleTimer(startMs: number, nowMs: number = Date.now()): boolean {
  return nowMs - startMs > CHRONATRA_STALE_TIMER_MS;
}
