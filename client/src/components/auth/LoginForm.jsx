// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, logIn, logInWithGoogle } from '../../features/auth/authSlice';

const LoginForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await dispatch(signUp({ email, password })).unwrap();
      } else {
        await dispatch(logIn({ email, password })).unwrap();
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(logInWithGoogle()).unwrap();
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
        <p>You are logged in!</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.includes('email-already-in-use')
              ? 'Email already in use. Please log in.'
              : error.includes('wrong-password')
              ? 'Incorrect password. Please try again.'
              : error.includes('user-not-found')
              ? 'No account found with this email.'
              : 'An error occurred. Please try again.'}
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
          {status === 'loading' ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        disabled={status === 'loading'}
        className={`mt-4 w-full py-2 px-4 rounded-md text-white ${
          status === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {status === 'loading' ? 'Processing...' : 'Log In with Google'}
      </button>
      <p className="mt-4 text-center">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={toggleMode}
          className="text-blue-500 hover:underline"
        >
          {isSignup ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;