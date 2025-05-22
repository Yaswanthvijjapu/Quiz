// src/components/quiz/QuizPlayer.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById, clearSelectedQuiz } from '../../features/quiz/quizSlice';
import { saveAttempt } from '../../features/attempt/attemptSlice';

const QuizPlayer = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedQuiz, status, error } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    console.log('Quiz ID from params:', quizId); // Debug
    if (!user) {
      navigate('/');
    } else if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
    return () => {
      dispatch(clearSelectedQuiz());
    };
  }, [quizId, user, dispatch, navigate]);

  useEffect(() => {
    console.log('Quiz state:', { selectedQuiz, status, error }); // Debug
  }, [selectedQuiz, status, error]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz?.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const score = selectedQuiz.questions.reduce((total, q, index) => {
      return answers[index] === q.correctAnswer ? total + 1 : total;
    }, 0);
    try {
      await dispatch(saveAttempt({ quizId, answers, score })).unwrap();
      console.log('Attempt saved:', { quizId, answers, score });
    } catch (err) {
      console.error('Failed to save attempt:', err);
    }
  };

  if (!user) return null;
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-500">Loading quiz...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500 text-center">
          {error.includes('not-found') ? 'Quiz not found.' : `Error: ${error}`}
        </p>
      </div>
    );
  }
  if (!selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-500">No quiz selected or quiz not found.</p>
      </div>
    );
  }

  if (isSubmitted) {
    const score = selectedQuiz.questions.reduce((total, q, index) => {
      return answers[index] === q.correctAnswer ? total + 1 : total;
    }, 0);
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-lg">Your Score: {score} / {selectedQuiz.questions.length}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{selectedQuiz.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
        <div className="mt-2 space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
              className={`block w-full p-2 text-left border rounded-md ${
                answers[currentQuestionIndex] === option
                  ? 'bg-blue-100 border-blue-500'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              disabled={isSubmitted}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`py-2 px-4 rounded-md ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers[currentQuestionIndex]}
            className={`py-2 px-4 rounded-md ${
              !answers[currentQuestionIndex]
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;