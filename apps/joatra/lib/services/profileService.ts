import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

import { ActivityLogger } from '@repo/core';

export const createUserProfile = async (
  userId: string,
  profileData: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
) => {
  const docRef = await addDoc(collection(db, 'profiles'), {
    ...profileData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  await ActivityLogger.profileUpdated(userId);
  
  return docRef;
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const q = query(
    collection(db, 'profiles'),
    where('userId', '==', userId),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  const profileDoc = querySnapshot.docs[0];
  if (!profileDoc) return null;
  const profileData = profileDoc.data();
  return { id: profileDoc.id, ...profileData } as UserProfile;
};

export const updateUserProfile = async (
  profileId: string,
  profileData: Partial<
    Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  >,
  userId?: string // Optional userId for logging
) => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, {
    ...profileData,
    updatedAt: serverTimestamp(),
  });
  
  if (userId) {
    await ActivityLogger.profileUpdated(userId);
  }
};
