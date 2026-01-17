"use server";

import { generateCoverLetter, GenerateActionPayload, ActionResult } from "../../lib/services/coverLetterServerService";

export async function generateCoverLetterAction(payload: GenerateActionPayload): Promise<ActionResult> {
  try {
    const result = await generateCoverLetter(payload);
    return result;
  } catch (error) {
    console.error("Cover Letter Action Error:", error);
    return { success: false, error: "Failed to generate cover letter" };
  }
}
