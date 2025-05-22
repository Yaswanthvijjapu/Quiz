// src/testFirebase.js
import { store } from './store';
import { fetchQuizzes, addQuiz, fetchQuizById, editQuiz, removeQuiz } from './features/quiz/quizSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/config';

const testQuizSlice = async () => {
  try {
    // Sign in a test user
    console.log('Signing in...');
    await signInWithEmailAndPassword(auth, 'test@example.com', 'Test1234!');
    console.log('Signed in');

    // Test addQuiz
    console.log('Testing addQuiz...');
    const quizData = {
      title: 'Test Quiz',
      category: 'General Knowledge',
      difficulty: 'Easy',
      questions: [
        { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
      ],
      tags: ['test', 'math'],
    };
    const addResult = await store.dispatch(addQuiz(quizData)).unwrap();
    console.log('Add Quiz Success:', addResult);
    const quizId = addResult.id;

    // Test fetchQuizzes
    console.log('Testing fetchQuizzes...');
    await store.dispatch(fetchQuizzes()).unwrap();
    console.log('Fetch Quizzes Success:', store.getState().quiz.quizzes);

    // Test fetchQuizById
    console.log('Testing fetchQuizById...');
    await store.dispatch(fetchQuizById(quizId)).unwrap();
    console.log('Fetch Quiz By ID Success:', store.getState().quiz.selectedQuiz);

    // Test editQuiz
    console.log('Testing editQuiz...');
    const updatedQuizData = {
      title: 'Updated Test Quiz',
      category: 'General Knowledge',
      difficulty: 'Medium',
      questions: [
        { question: 'What is 3+3?', options: ['5', '6', '7'], correctAnswer: '6' },
      ],
      tags: ['test', 'math'],
    };
    await store.dispatch(editQuiz({ quizId, quizData: updatedQuizData })).unwrap();
    console.log('Edit Quiz Success:', store.getState().quiz.selectedQuiz);

    // Test removeQuiz
    console.log('Testing removeQuiz...');
    await store.dispatch(removeQuiz(quizId)).unwrap();
    console.log('Remove Quiz Success:', store.getState().quiz.quizzes);
  } catch (error) {
    console.error('Quiz Slice Test Error:', error);
  }
};

testQuizSlice();