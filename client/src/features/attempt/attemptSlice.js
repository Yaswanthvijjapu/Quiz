// src/features/attempt/attemptSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAttempt,
  getUserAttempts,
  getAllAttempts,
} from '../../firebase/firestore';

// Async thunks
export const saveAttempt = createAsyncThunk(
  'attempt/saveAttempt',
  async ({ quizId, answers }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user) {
        throw new Error('User not authenticated');
      }
      const attemptData = {
        userId: auth.user.uid,
        quizId,
        answers,
        score: Object.keys(answers).reduce((total, qIndex) => {
          // Placeholder: Score calculation (to be refined with quiz data)
          return total + (answers[qIndex] ? 1 : 0);
        }, 0),
        createdAt: new Date().toISOString(),
      };
      const attempt = await createAttempt(attemptData);
      return attempt;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserAttempts = createAsyncThunk(
  'attempt/fetchUserAttempts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user) {
        throw new Error('User not authenticated');
      }
      const attempts = await getUserAttempts(auth.user.uid);
      return attempts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllAttempts = createAsyncThunk(
  'attempt/fetchAllAttempts',
  async (_, { rejectWithValue }) => {
    try {
      const attempts = await getAllAttempts();
      return attempts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  attempts: [],
  userAttempts: [],
  status: 'idle',
  error: null,
};

// Attempt slice
const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Save Attempt
    builder
      .addCase(saveAttempt.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(saveAttempt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAttempts.push(action.payload);
        state.attempts.push(action.payload);
        state.error = null;
      })
      .addCase(saveAttempt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch User Attempts
    builder
      .addCase(fetchUserAttempts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserAttempts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAttempts = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAttempts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch All Attempts
    builder
      .addCase(fetchAllAttempts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllAttempts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attempts = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAttempts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export reducer
export default attemptSlice.reducer;