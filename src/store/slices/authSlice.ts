import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import type { LoginCredentials, SignupData, User } from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  signupLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const loadUserFromStorage = (): { user: User | null; token: string | null } => {
  try {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      return { user: JSON.parse(userStr), token };
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
  }
  return { user: null, token: null };
};

const { user: initialUser, token: initialToken } = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  signupLoading: false,
  error: null,
  isAuthenticated: !!initialUser && !!initialToken,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const user: User = {
        id: 1,
        email: credentials.username,
        username: credentials.username,
        token: response.token,
      };
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid username or password');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (signupData: SignupData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(signupData);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create account');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token || 'mock-token';
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.signupLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.user = action.payload;
        state.token = action.payload.token || 'mock-token';
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', state.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
