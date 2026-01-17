"use server";

import { cvServerService } from "@/lib/services/cvServerService";
import { Job, UserProfile } from "@/lib/types";

export async function generateCVContentAction(profile: UserProfile, job: Job) {
  try {
    const content = await cvServerService.generateFullCVContent(profile, job);
    return { success: true, content };
  } catch (error) {
    console.error("Failed to generate CV content:", error);
    return { success: false, error: "Failed to generate CV content" };
  }
}
