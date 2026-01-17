import { Job } from "@/lib/types";

// --- Keyword Extraction ---
const extractTechKeywords = (text: string): string[] => {
  const techKeywordList = [
    'javascript',
    'typescript',
    'react',
    'angular',
    'vue',
    'node.js',
    'node',
    'express',
    'next.js',
    'nextjs',
    'html',
    'css',
    'sass',
    'less',
    'sql',
    'nosql',
    'postgresql',
    'mysql',
    'mongodb',
    'firebase',
    'aws',
    'azure',
    'git',
    'github',
    'gitlab',
    'ci/cd',
    'docker',
    'kubernetes',
    'python',
    'django',
    'flask',
    'java',
    'spring',
    'c#',
    '.net',
    'php',
    'laravel',
    'symfony',
    'ruby',
    'rails',
    'swift',
    'kotlin',
    'flutter',
    'dart',
    'react native',
    'android',
    'ios',
    'agile',
    'scrum',
    'kanban',
    'jira',
    'confluence',
    'figma',
    'sketch',
    'adobe xd',
    'photoshop',
    'illustrator',
    'redux',
    'graphql',
    'rest',
    'api',
    'microservices',
    'testing',
    'jest',
    'cypress',
    'selenium',
  ];
  return techKeywordList.filter((keyword) => text.includes(keyword));
};

const extractSoftSkills = (text: string): string[] => {
  const softSkillsList = [
    'communication',
    'kommunikation',
    'teamwork',
    'team',
    'leadership',
    'führung',
    'problem solving',
    'problemlösung',
    'time management',
    'zeitmanagement',
    'adaptability',
    'anpassungsfähigkeit',
    'creativity',
    'kreativität',
    'critical thinking',
    'kritisches denken',
    'emotional intelligence',
    'emotionale intelligenz',
    'negotiation',
    'verhandlung',
    'conflict resolution',
    'konfliktlösung',
    'decision making',
    'entscheidungsfindung',
    'presentation',
    'präsentation',
    'customer service',
    'kundenservice',
    'mentoring',
    'coaching',
  ];
  return softSkillsList.filter((skill) => text.includes(skill));
};

export const extractKeywords = (job: Job | null): string[] => {
  if (!job) return [];
  const keywordSources = [
    job.jobTitle,
    job.company,
    job.notes || '',
    ...(job.techStack || []),
  ].filter(Boolean);
  const combinedText = keywordSources.join(' ').toLowerCase();
  const techKeywords = extractTechKeywords(combinedText);
  const softSkills = extractSoftSkills(combinedText);
  return [...new Set([...techKeywords, ...softSkills])];
};
