// src/testFirebase.js
import { store } from './store';
import { signUp, logIn, logInWithGoogle, logOutUser } from './features/auth/authSlice';

const testAuthSlice = async () => {
  try {
    // Test signup
    console.log('Testing signup...');
    await store.dispatch(signUp({ email: 'test@example.com', password: 'Test1234!' })).unwrap();
    console.log('Signup Success:', store.getState().auth.user);

    // Test login
    console.log('Testing login...');
    await store.dispatch(logIn({ email: 'test@example.com', password: 'Test1234!' })).unwrap();
    console.log('Login Success:', store.getState().auth.user);

    // Test Google login (manual interaction required)
    console.log('Testing Google login...');
    // Uncomment to test: await store.dispatch(logInWithGoogle()).unwrap();
    // console.log('Google Login Success:', store.getState().auth.user);

    // Test logout
    console.log('Testing logout...');
    await store.dispatch(logOutUser()).unwrap();
    console.log('Logout Success:', store.getState().auth.user);
  } catch (error) {
    console.error('Auth Slice Test Error:', error);
  }
};

testAuthSlice();