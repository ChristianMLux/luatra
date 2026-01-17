import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { GeneratedCV } from '../types';

export const cvClientService = {
  async createGeneratedCV(userId: string, data: Omit<GeneratedCV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, 'generatedCVs'), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async getGeneratedCV(cvId: string): Promise<GeneratedCV | null> {
    const snap = await getDoc(doc(db, 'generatedCVs', cvId));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as GeneratedCV;
    return null;
  },

   async getUserCVs(userId: string): Promise<GeneratedCV[]> {
    const q = query(collection(db, 'generatedCVs'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GeneratedCV));
  },

  async updateGeneratedCV(cvId: string, data: Partial<GeneratedCV>) {
    return updateDoc(doc(db, 'generatedCVs', cvId), { ...data, updatedAt: serverTimestamp() });
  },

  async deleteGeneratedCV(cvId: string) {
     return deleteDoc(doc(db, 'generatedCVs', cvId));
  }
};
