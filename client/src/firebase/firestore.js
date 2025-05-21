// src/firebase/firestore.js
import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

// Quiz CRUD Operations
// Create a quiz
export const createQuiz = async (quizData) => {
  try {
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: new Date(),
    });
    return { id: quizRef.id, ...quizData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all quizzes
export const getQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'quizzes'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a single quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (quizDoc.exists()) {
      return { id: quizDoc.id, ...quizDoc.data() };
    }
    throw new Error('Quiz not found');
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a quiz
export const updateQuiz = async (quizId, quizData) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, quizData);
    return { id: quizId, ...quizData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a quiz
export const deleteQuiz = async (quizId) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Save quiz attempt for leaderboard
export const saveQuizAttempt = async (attemptData) => {
  try {
    const attemptRef = await addDoc(collection(db, 'attempts'), {
      ...attemptData,
      timestamp: new Date(),
    });
    return { id: attemptRef.id, ...attemptData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get leaderboard for a specific quiz
export const getLeaderboard = async (quizId) => {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('quizId', '==', quizId),
      orderBy('score', 'desc'),
      orderBy('timeTaken', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};