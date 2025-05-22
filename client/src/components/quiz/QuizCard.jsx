// src/components/quiz/QuizCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div className="p-4 border rounded-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <p className="text-sm text-gray-600">Category: {quiz.category}</p>
      <p className="text-sm text-gray-600">Difficulty: {quiz.difficulty}</p>
      <p className="text-sm text-gray-600">Questions: {quiz.questions.length}</p>
      <p className="text-sm text-gray-600">
        Created: {new Date(quiz.createdAt).toLocaleDateString()}
      </p>
      <Link
        to={`/quiz/${quiz.id}`}
        className="mt-2 inline-block py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Take Quiz
      </Link>
    </div>
  );
};

export default QuizCard;