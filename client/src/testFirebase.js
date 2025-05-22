// src/testFirebase.js
import { createQuiz, getQuizzes } from './firebase/firestore';

const testFirestore = async () => {
  try {
    console.log('Testing createQuiz...');
    const quizData = {
      title: 'Test Quiz',
      category: 'General Knowledge',
      difficulty: 'Easy',
      questions: [
        { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
      ],
      tags: ['test', 'math'],
    };
    const newQuiz = await createQuiz(quizData);
    console.log('Quiz Created:', newQuiz);

    console.log('Testing getQuizzes...');
    const quizzes = await getQuizzes();
    console.log('Quizzes:', quizzes);
  } catch (error) {
    console.error('Firestore Test Error:', error.message);
  }
};

testFirestore();