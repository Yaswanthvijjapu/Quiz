// src/components/auth/LogoutButton.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../features/auth/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logOutUser()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Only show the button if the user is logged in
  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      disabled={status === 'loading'}
      className={`py-2 px-4 rounded-md text-white ${
        status === 'loading'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      {status === 'loading' ? 'Logging Out...' : 'Log Out'}
    </button>
  );
};

export default LogoutButton;