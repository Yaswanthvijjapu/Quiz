// src/components/leaderboard/ScoreChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreChart = ({ attempts, quizzes }) => {
  // Prepare data for top 10 attempts
  const sortedAttempts = [...attempts]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((attempt) => ({
      ...attempt,
      quizTitle: quizzes.find((q) => q.id === attempt.quizId)?.title || 'Unknown Quiz',
    }));

  // Chart.js configuration
  const chartData = {
    type: 'bar',
    data: {
      labels: sortedAttempts.map((a) => `${a.quizTitle} (${a.userId.slice(0, 8)})`),
      datasets: [
        {
          label: 'Score',
          data: sortedAttempts.map((a) => a.score),
          backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue with opacity
          borderColor: 'rgba(59, 130, 246, 1)', // Solid blue
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Score',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Quiz (User)',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Top Scores',
        },
      },
    },
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
      {sortedAttempts.length === 0 ? (
        <p className="text-center text-gray-500">No scores available to display.</p>
      ) : (
        <div className="chart-container">
          <Bar data={chartData.data} options={chartData.options} />
        </div>
      )}
    </div>
  );
};
export default ScoreChart;