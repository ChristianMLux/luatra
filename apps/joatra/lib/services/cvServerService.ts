import { aiService } from './aiService';
import {
  Job,
  UserProfile,
  Experience,
  Skill,
} from '../types';

export interface CVContent {
  personalDetails: UserProfile['personalDetails'];
  summary: string;
  skills: Skill[];
  experience: Experience[];
  education: UserProfile['education'];
  languages: UserProfile['languages'];
  interests: string[];
}

export const cvServerService = {
  // 1. Generate Summary
  async generateSummary(profile: UserProfile, job: Job): Promise<string> {
   const prompt = `
      You are an expert CV writer. Your task is to write a compelling professional summary for a CV that is tailored to a specific job description.

      CANDIDATE PROFILE:
      ${JSON.stringify(profile.summary || "Experienced professional")}
      Skills: ${profile.skills.map(s => s.name).join(", ")}
      Experience: ${profile.experience.map(e => `${e.position} at ${e.company}`).join("; ")}

      TARGET JOB:
      Title: ${job.jobTitle}
      Company: ${job.company}
      Description: ${job.description || "N/A"}

      INSTRUCTIONS:
      - Write a concise, professional summary (3-5 sentences).
      - Highlight relevant skills and experiences that match the job description.
      - Use strong action verbs.
      - Do not include greetings or placeholders.
      - Output ONLY the summary text.
    `;
    const schema = `{"summary": "string"}`;
    const res = await aiService.generateJSON<{summary: string}>(prompt, schema);
    return res.summary;
  },

  // 2. Select/Optimize Skills
  async generateSkills(profile: UserProfile, job: Job): Promise<Skill[]> {
    const prompt = `
      You are an expert CV writer. Select the most relevant skills from the candidate's profile that match the target job.
      
      CANDIDATE SKILLS:
      ${JSON.stringify(profile.skills)}

      TARGET JOB:
      Title: ${job.jobTitle}
      Description: ${job.description || "N/A"}
      Tech Stack: ${job.techStack ? job.techStack.join(", ") : "N/A"}

      INSTRUCTIONS:
      - Select up to 12 skills that are most relevant to the job.
      - You can also add skills that are implied by the candidate's experience if they are critical for the job, but prioritize existing skills.
      - Rank them by relevance.
      - Output strictly in JSON format as a list of objects with 'name' and 'level' (optional).
    `;
    const schema = `
      {
        "skills": [
          {"name": "string", "level": "string (optional)"}
        ]
      }
    `;
    const res = await aiService.generateJSON<{skills: Skill[]}>(prompt, schema);
    return res.skills;
  },

  // 3. Optimize Experience
  async optimizeExperience(experience: Experience, job: Job): Promise<Experience> {
    const prompt = `
      You are an expert CV writer. optimize the bullet points (highlights) of this work experience to better match the target job.

      EXPERIENCE ENTRY:
      Position: ${experience.position}
      Company: ${experience.company}
      Description: ${experience.description || ""}
      Current Highlights: ${JSON.stringify(experience.highlights || [])}

      TARGET JOB:
      Title: ${job.jobTitle}
      Description: ${job.description || "N/A"}

      INSTRUCTIONS:
      - Rewrite the highlights to emphasize relevance to the target job.
      - Use the STAR method (Situation, Task, Action, Result) where possible.
      - Use strong action verbs.
      - Keep it truthful to the original experience but framed effectively.
      - If no highlights exist, generate 3-5 based on the description and standard duties for this role, tailored to the target job.
      - Output strictly in JSON format.
    `;
    
    const schema = `
      {
        "highlights": ["string"]
      }
    `;

    try {
        const res = await aiService.generateJSON<{highlights: string[]}>(prompt, schema);
        return { ...experience, highlights: res.highlights };
    } catch (e) {
        console.error("Failed to optimize experience", e);
        return experience;
    }
  },

  // 4. Orchestrator
  async generateFullCVContent(profile: UserProfile, job: Job): Promise<CVContent> {
    const [summary, skills, optimizedExperience] = await Promise.all([
      this.generateSummary(profile, job),
      this.generateSkills(profile, job),
      Promise.all(profile.experience.map(exp => this.optimizeExperience(exp, job)))
    ]);

    return {
      personalDetails: profile.personalDetails,
      summary,
      skills,
      experience: optimizedExperience,
      education: profile.education,
      languages: profile.languages,
      interests: profile.interests || [],
    };
  }
};
