// src/features/quiz/quizSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from '../../firebase/firestore';

// Async thunks for quiz operations
export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const quizzes = await getQuizzes();
      return quizzes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (quizId, { rejectWithValue }) => {
    try {
      const quiz = await getQuizById(quizId);
      return quiz;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addQuiz = createAsyncThunk(
  'quiz/addQuiz',
  async (quizData, { rejectWithValue }) => {
    try {
      const newQuiz = await createQuiz(quizData);
      return newQuiz;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editQuiz = createAsyncThunk(
  'quiz/editQuiz',
  async ({ quizId, quizData }, { rejectWithValue }) => {
    try {
      const updatedQuiz = await updateQuiz(quizId, quizData);
      return updatedQuiz;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeQuiz = createAsyncThunk(
  'quiz/removeQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      await deleteQuiz(quizId);
      return quizId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  quizzes: [],
  selectedQuiz: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Quiz slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearSelectedQuiz: (state) => {
      state.selectedQuiz = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Quiz by ID
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedQuiz = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Add Quiz
    builder
      .addCase(addQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes.push(action.payload);
        state.error = null;
      })
      .addCase(addQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Edit Quiz
    builder
      .addCase(editQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedQuiz = action.payload;
        state.quizzes = state.quizzes.map((quiz) =>
          quiz.id === updatedQuiz.id ? updatedQuiz : quiz
        );
        if (state.selectedQuiz && state.selectedQuiz.id === updatedQuiz.id) {
          state.selectedQuiz = updatedQuiz;
        }
        state.error = null;
      })
      .addCase(editQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Remove Quiz
    builder
      .addCase(removeQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload);
        if (state.selectedQuiz && state.selectedQuiz.id === action.payload) {
          state.selectedQuiz = null;
        }
        state.error = null;
      })
      .addCase(removeQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearSelectedQuiz } = quizSlice.actions;

// Export reducer
export default quizSlice.reducer;