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
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { TimeEntry } from '../types';
import { ChronatraLogger } from '@repo/core';

const COLLECTION_PATH = 'apps/chronatra/timeEntries';

/**
 * Add a new time entry (start timer)
 */
export const addTimeEntry = async (
  userId: string,
  entryData: Omit<TimeEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  projectName?: string,
): Promise<string> => {
  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(entryData).filter(([_, v]) => v !== undefined)
  );

  const docRef = await addDoc(collection(db, COLLECTION_PATH), {
    ...cleanData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Log activity for Hub widget
  await ChronatraLogger.timerStarted(userId, entryData.description || 'Started timer', docRef.id, entryData.projectId, projectName);

  return docRef.id;
};

/**
 * Stop a running time entry
 */
export const stopTimeEntry = async (
  userId: string,
  entryId: string,
  durationMs: number,
  description?: string,
  projectName?: string,
): Promise<void> => {
  const entryRef = doc(db, COLLECTION_PATH, entryId);
  
  await updateDoc(entryRef, {
    endTime: Timestamp.now(),
    duration: durationMs,
    isRunning: false,
    updatedAt: serverTimestamp(),
  });

  // Log activity for Hub widget
  await ChronatraLogger.timerStopped(userId, durationMs, entryId, description, projectName);
};

/**
 * Get currently running entry (if any)
 */
export const getRunningEntry = async (userId: string): Promise<TimeEntry | null> => {
  const q = query(
    collection(db, COLLECTION_PATH),
    where('userId', '==', userId),
    where('isRunning', '==', true),
    limit(1),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;

  return { id: docSnap.id, ...docSnap.data() } as TimeEntry;
};

/**
 * Get time entries for a user
 */
export const getTimeEntries = async (
  userId: string,
  limitCount = 50,
): Promise<TimeEntry[]> => {
  const q = query(
    collection(db, COLLECTION_PATH),
    where('userId', '==', userId),
    orderBy('startTime', 'desc'),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);
  const entries: TimeEntry[] = [];
  snapshot.forEach((doc) => {
    entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
  });

  return entries;
};

/**
 * Get time entries within a date range
 */
export const getTimeEntriesByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<TimeEntry[]> => {
  const q = query(
    collection(db, COLLECTION_PATH),
    where('userId', '==', userId),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate)),
    orderBy('startTime', 'desc'),
  );

  const snapshot = await getDocs(q);
  const entries: TimeEntry[] = [];
  snapshot.forEach((doc) => {
    entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
  });

  return entries;
};

/**
 * Update a time entry
 */
export const updateTimeEntry = async (
  entryId: string,
  data: Partial<Omit<TimeEntry, 'id' | 'userId' | 'createdAt'>>,
): Promise<void> => {
  const entryRef = doc(db, COLLECTION_PATH, entryId);
  await updateDoc(entryRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a time entry
 */
export const deleteTimeEntry = async (entryId: string): Promise<void> => {
  const entryRef = doc(db, COLLECTION_PATH, entryId);
  await deleteDoc(entryRef);
};
