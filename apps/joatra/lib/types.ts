import { Timestamp } from 'firebase/firestore';

export interface Job {
  id?: string;
  company: string;
  jobTitle: string;
  jobUrl: string;
  applicationDate: string | Date | Timestamp;
  status: 'Gespeichert' | 'Beworben' | 'Interview' | 'Angebot' | 'Abgelehnt';
  description?: string;
  notes?: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  location?: string;
  companyStreet?: string;
  companyPostalCode?: string;
  companyCity?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  techStack?: string[];
  contactPerson?: {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
  };
  rejectionReason?: string;
  recruiterId?: string;
  recruiterName?: string;
  // External Job Fields
  isExternal?: boolean;
  externalId?: string;
  source?: string;
  applyUrl?: string;
  // AI Matching Fields
  matchScore?: number;
  matchReasoning?: string;
  postedDate?: string;
}

export interface Recruiter {
  id?: string;
  name: string;
  company?: string;
  notes?: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string | number | Date | Timestamp;
  endDate?: string | number | Date | Timestamp;
  location?: string;
  description?: string;
  ongoing?: boolean;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string | number | Date | Timestamp;
  endDate?: string | number | Date | Timestamp;
  location?: string;
  description?: string;
  highlights?: string[];
  ongoing?: boolean;
}

export interface OtherExperience {
  id?: string;
  title: string;
  institution?: string;
  startDate: string | number | Date | Timestamp;
  endDate?: string | number | Date | Timestamp;
  ongoing?: boolean;
  description?: string;
  location?: string;
  excludeFromCV?: boolean;
}

export interface Skill {
  id?: string;
  name: string;
  level?: 'Grundkenntnisse' | 'Gut' | 'Sehr gut' | 'Experte';
  category?: 'Technical' | 'Soft' | 'Language' | 'Other';
}

export interface Language {
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Muttersprache';
}

export interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  date: string | Date | Timestamp;
  description?: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  birthDate?: string | Date | Timestamp;
  birthPlace?: string;
  nationality?: string;
  photo?: string;
  website?: string;
  linkedin?: string;
  xing?: string;
  github?: string;
  photoBusinessUrl?: string;
  photoCasualUrl?: string;
  activePhotoType?: 'business' | 'casual';
  photoShape?: 'circle' | 'square' | 'rounded-square';
}

export interface UserProfile {
  id?: string;
  userId: string;
  personalDetails: PersonalDetails;
  summary?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  certificates?: Certificate[];
  interests?: string[];
  otherExperiences?: OtherExperience[];
  additionalInfo?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  language: 'de' | 'en';
  type: 'standard' | 'modern' | 'academic' | 'creative' | 'enhanced';
  atsOptimized: boolean;
  photoIncluded: boolean;
}

export interface GeneratedCV {
  id?: string;
  userId: string;
  jobId?: string;
  profileId: string;
  templateId: string;
  content: any;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  accentColor?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  partialContent?: any;
  error?: string;
}

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  language: 'de' | 'en';
  style: 'formal' | 'modern' | 'creative';
  atsOptimized: boolean;
  din5008Compliant?: boolean;
}

export interface GeneratedCoverLetter {
  id?: string;
  userId: string;
  jobId?: string;
  profileId: string;
  templateId: string;
  content: any;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  accentColor?: string;
}
