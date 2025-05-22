// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signUpWithEmail,
  logInWithEmail,
  logInWithGoogle as firebaseLogInWithGoogle, // Alias the import
  logOut,
  onAuthStateChanged,
} from '../../firebase/auth';

// Async thunks for authentication actions
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signUpWithEmail(email, password);
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/logIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await logInWithEmail(email, password);
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logInWithGoogle = createAsyncThunk(
  'auth/logInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await firebaseLogInWithGoogle(); // Use aliased function
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logOutUser = createAsyncThunk(
  'auth/logOut',
  async (_, { rejectWithValue }) => {
    try {
      await logOut();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Log In
    builder
      .addCase(logIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Log In with Google
    builder
      .addCase(logInWithGoogle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logInWithGoogle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logInWithGoogle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Log Out
    builder
      .addCase(logOutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.error = null;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setUser, clearUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Initialize auth state listener
export const initializeAuthListener = () => (dispatch) => {
  onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUser({ uid: user.uid, email: user.email }));
    } else {
      dispatch(clearUser());
    }
  });
};