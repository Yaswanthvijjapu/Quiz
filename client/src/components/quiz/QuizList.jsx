// src/components/quiz/QuizList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quiz/quizSlice';
import QuizCard from './QuizCard';

const QuizList = () => {
  const dispatch = useDispatch();
  const { quizzes, status, error } = useSelector((state) => state.quiz);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [status, dispatch]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
      {status === 'loading' && (
        <p className="text-center text-gray-500">Loading quizzes...</p>
      )}
      {error && (
        <p className="text-red-500 text-center">
          {error.includes('permission-denied')
            ? 'Please log in to view quizzes.'
            : 'Failed to load quizzes. Please try again.'}
        </p>
      )}
      {status === 'succeeded' && quizzes.length === 0 && (
        <p className="text-center text-gray-500">No quizzes available.</p>
      )}
      {status === 'succeeded' && quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;