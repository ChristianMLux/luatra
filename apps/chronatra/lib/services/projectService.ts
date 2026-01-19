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
import { Project } from '../types';

const COLLECTION_PATH = 'apps/chronatra/projects';

/**
 * Add a new project
 */
export const addProject = async (
  userId: string,
  projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_PATH), {
    ...projectData,
    userId,
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Get all projects for a user (excluding archived by default)
 */
export const getProjects = async (
  userId: string,
  includeArchived = false,
): Promise<Project[]> => {
  let q = query(
    collection(db, COLLECTION_PATH),
    where('userId', '==', userId),
    orderBy('name', 'asc'),
  );

  const snapshot = await getDocs(q);
  const projects: Project[] = [];
  
  snapshot.forEach((doc) => {
    const project = { id: doc.id, ...doc.data() } as Project;
    if (includeArchived || !project.isArchived) {
      projects.push(project);
    }
  });

  return projects;
};

/**
 * Update a project
 */
export const updateProject = async (
  projectId: string,
  data: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>,
): Promise<void> => {
  const projectRef = doc(db, COLLECTION_PATH, projectId);
  await updateDoc(projectRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Archive a project (soft delete)
 */
export const archiveProject = async (projectId: string): Promise<void> => {
  await updateProject(projectId, { isArchived: true });
};

/**
 * Delete a project permanently
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  const projectRef = doc(db, COLLECTION_PATH, projectId);
  await deleteDoc(projectRef);
};

/**
 * Default project colors
 */
export const PROJECT_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#14B8A6', // teal
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
];
