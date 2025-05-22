// src/components/quiz/QuizForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigation after save
import { addQuiz, editQuiz } from '../../features/quiz/quizSlice';

const QuizForm = ({ quizToEdit = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.quiz);

  // Initialize form state
  const [formData, setFormData] = useState({
    title: quizToEdit?.title || '',
    category: quizToEdit?.category || '',
    difficulty: quizToEdit?.difficulty || 'Easy',
    tags: quizToEdit?.tags?.join(', ') || '',
    questions: quizToEdit?.questions || [
      { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/'); // Assuming '/' shows LoginForm
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[qIndex].options[oIndex] = value;
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizData = {
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        questions: formData.questions.map((q) => ({
          question: q.question,
          options: q.options.filter(Boolean),
          correctAnswer: q.correctAnswer,
        })),
      };

      if (quizToEdit) {
        await dispatch(editQuiz({ quizId: quizToEdit.id, quizData })).unwrap();
      } else {
        await dispatch(addQuiz(quizData)).unwrap();
      }
      navigate('/'); // Redirect to home or quiz list
    } catch (err) {
      // Error handled by Redux state
    }
  };

  if (!user) return null; // Don't render if not authenticated

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {quizToEdit ? 'Edit Quiz' : 'Create Quiz'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., math, science"
          />
        </div>
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        {formData.questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 border rounded-md">
            <div className="mb-2">
              <label
                htmlFor={`question-${qIndex}`}
                className="block text-sm font-medium text-gray-700"
              >
                Question {qIndex + 1}
              </label>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder={`Option ${oIndex + 1}`}
                  required
                />
              ))}
            </div>
            <div className="mb-2">
              <label
                htmlFor={`correctAnswer-${qIndex}`}
                className="block text-sm font-medium text-gray-700"
              >
                Correct Answer
              </label>
              <input
                type="text"
                id={`correctAnswer-${qIndex}`}
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, 'correctAnswer', e.target.value)
                }
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {formData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 hover:underline"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="mb-4 py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Question
        </button>
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.includes('permission-denied')
              ? 'Please log in to save the quiz.'
              : 'Failed to save quiz. Please try again.'}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded-md text-white ${
            status === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {status === 'loading' ? 'Saving...' : quizToEdit ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;