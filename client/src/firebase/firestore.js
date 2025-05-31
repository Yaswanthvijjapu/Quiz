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

export const createQuiz = async (quizData) => {
  try {
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: new Date().toISOString(), 
    });
    return { id: quizRef.id, ...quizData, createdAt: new Date().toISOString() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'quizzes'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

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

export const updateQuiz = async (quizId, quizData) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, quizData);
    return { id: quizId, ...quizData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const createAttempt = async (attemptData) => {
  try {
    const attemptRef = await addDoc(collection(db, 'attempts'), attemptData);
    return { id: attemptRef.id, ...attemptData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserAttempts = async (userId) => {
  try {
    const q = query(collection(db, 'attempts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllAttempts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'attempts'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

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