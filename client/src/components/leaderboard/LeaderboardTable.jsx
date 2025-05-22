// src/components/leaderboard/LeaderboardTable.jsx
import React from 'react';

const LeaderboardTable = ({ attempts, quizzes }) => {
  // Sort attempts by score (descending) and limit to top 10
  const sortedAttempts = [...attempts]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((attempt) => ({
      ...attempt,
      quizTitle: quizzes.find((q) => q.id === attempt.quizId)?.title || 'Unknown Quiz',
    }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Quiz</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedAttempts.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                No attempts available.
              </td>
            </tr>
          ) : (
            sortedAttempts.map((attempt, index) => (
              <tr key={attempt.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{attempt.userId.slice(0, 8)}...</td>
                <td className="px-4 py-2">{attempt.quizTitle}</td>
                <td className="px-4 py-2">{attempt.score}</td>
                <td className="px-4 py-2">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;