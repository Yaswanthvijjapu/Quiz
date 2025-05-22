import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAttempts } from '../../features/attempt/attemptSlice';
import { fetchQuizzes } from '../../features/quiz/quizSlice';
import LeaderboardTable from './LeaderboardTable';
import ScoreChart from './ScoreChart';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { attempts, status: attemptStatus, error: attemptError } = useSelector(
    (state) => state.attempt
  );
  const { quizzes, status: quizStatus, error: quizError } = useSelector(
    (state) => state.quiz
  );

  useEffect(() => {
    if (attemptStatus === 'idle') {
      dispatch(fetchAllAttempts());
    }
    if (quizStatus === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [attemptStatus, quizStatus, dispatch]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      {(attemptStatus === 'loading' || quizStatus === 'loading') && (
        <p className="text-center text-gray-500">Loading leaderboard...</p>
      )}
      {(attemptError || quizError) && (
        <p className="text-red-500 text-center">
          Failed to load leaderboard: {attemptError || quizError}
        </p>
      )}
      {attemptStatus === 'succeeded' && quizStatus === 'succeeded' && (
        <>
          <LeaderboardTable attempts={attempts} quizzes={quizzes} />
          <ScoreChart attempts={attempts} quizzes={quizzes} />
        </>
      )}
    </div>
  );
};

export default Leaderboard;