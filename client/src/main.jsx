// src/main.jsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './store';
import { initializeAuthListener } from './features/auth/authSlice';
import './index.css';
import './testFirebase'; // Import test file

store.dispatch(initializeAuthListener());

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);