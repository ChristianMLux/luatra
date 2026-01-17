import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Job } from '../types';

import { ActivityLogger } from '@repo/core';

// --- Firestore Operations ---

export const addJob = async (
  userId: string,
  jobData: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
) => {
  const docRef = await addDoc(collection(db, 'jobs'), {
    ...jobData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Log activity
  await ActivityLogger.jobCreated(userId, jobData.company, docRef.id);
  
  return docRef;
};

export const getJobs = async (userId: string): Promise<Job[]> => {
  const q = query(
    collection(db, 'jobs'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const querySnapshot = await getDocs(q);
  const jobs: Job[] = [];
  querySnapshot.forEach((doc) => {
    jobs.push({ id: doc.id, ...doc.data() } as Job);
  });
  return jobs;
};

export const updateJob = async (
  jobId: string,
  jobData: Partial<Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
) => {
  const jobRef = doc(db, 'jobs', jobId);
  
  await updateDoc(jobRef, {
    ...jobData,
    updatedAt: serverTimestamp(),
  });
};

export const updateJobWithLog = async (
  userId: string, 
  jobId: string,
  company: string, // passed from UI to avoid fetch
  jobData: Partial<Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
) => {
   const jobRef = doc(db, 'jobs', jobId);
   await updateDoc(jobRef, {
    ...jobData,
    updatedAt: serverTimestamp(),
  });
  
  await ActivityLogger.jobUpdated(userId, company || "Unknown Company", jobId);
};

// Re-implementing original updateJob to maintain compatibility but adding TODO


export const deleteJob = async (jobId: string, userId?: string, company?: string) => {
  const jobRef = doc(db, 'jobs', jobId);
  await deleteDoc(jobRef);
  
  if (userId && company) {
    await ActivityLogger.jobDeleted(userId, company, jobId);
  }
};
