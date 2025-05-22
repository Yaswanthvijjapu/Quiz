// src/App.jsx
import React from 'react';
import LoginForm from './components/auth/LoginForm';
import LogoutButton from './components/auth/LogoutButton';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoginForm />
        <LogoutButton />
      </div>
    </div>
  );
}

export default App;