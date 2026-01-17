import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date | Timestamp | undefined | null): string {
  if (!date) return "";
  
  try {
    let d: Date;
    if (date instanceof Timestamp) {
      d = date.toDate();
    } else if (typeof date === "string" || typeof date === "number") {
      d = new Date(date);
    } else {
      d = date;
    }
    
    // Check if valid
    if (isNaN(d.getTime())) return "";

    return format(d, "MMM yyyy");
  } catch (e) {
    return "";
  }
}

/**
 * Robustly parses JSON from a string, handling Markdown code blocks and common formatting issues.
 * Useful for processing LLM outputs.
 */
export function safeParseJSON<T>(text: string): T {
  let cleanText = text.trim();

  if (cleanText.includes('```')) {
    cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '');
  }

  cleanText = cleanText.trim();

  try {
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    // console.error('Input text was:', text); // Optional logging
    throw new Error('Failed to parse JSON response from AI');
  }
}
