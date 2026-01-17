"use client";

import { useJobsContext } from "../context/JobsContext";

export function useJobs() {
  return useJobsContext();
}
