// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import LogoutButton from './components/auth/LogoutButton';
import QuizForm from './components/quiz/QuizForm';
import QuizList from './components/quiz/QuizList';
import QuizPlayer from './components/quiz/QuizPlayer';
import Leaderboard from './components/leaderboard/Leaderboard';
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <nav className="mb-8">
        <Link to="/" className="text-blue-500 hover:underline mx-2">
          Home
        </Link>
        {user && (
          <Link to="/create-quiz" className="text-blue-500 hover:underline mx-2">
            Create Quiz
          </Link>
        )}
        <Link to="/leaderboard" className="text-blue-500 hover:underline mx-2">
          Leaderboard
        </Link>
      </nav>
      <div className="flex flex-col items-center gap-4 mb-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LoginForm />
                <LogoutButton />
                <QuizList />
              </>
            }
          />
          <Route path="/create-quiz" element={<QuizForm />} />
          <Route path="/quiz/:quizId" element={<QuizPlayer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;