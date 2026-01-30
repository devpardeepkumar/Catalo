import { authApi } from '@/services/api/authApi';
import { RegistrationFormData } from '@/types/authType';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types for the auth state
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  registrationSuccess: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  registrationSuccess: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegistrationFormData, { rejectWithValue }) => {
    try {
      // Validate that passwords match before making API call
      if (userData.password !== userData.confirmPassword) {
        return rejectWithValue('Passwords do not match');
      }

      const response = await authApi.register(userData);
      return response;
    } catch (error: any) {
        
      // Handle API errors with better error messages
      if (error.response) {
        const { status, data } = error.response;

        // Handle specific HTTP status codes
        switch (status) {
          case 400:
            // Bad Request - validation errors
            if (data.message) {
              return rejectWithValue(data.message);
            }
            if (data.errors && Array.isArray(data.errors)) {
              return rejectWithValue(data.errors[0].message || 'Invalid registration data');
            }
            return rejectWithValue('Invalid registration data');

          case 409:
            // Conflict - user already exists
            return rejectWithValue(data.message || 'User already exists with this email');

          case 422:
            // Unprocessable Entity - validation errors
            if (data.message) {
              return rejectWithValue(data.message);
            }
            if (data.errors && typeof data.errors === 'object') {
              const firstError = Object.values(data.errors)[0];
              return rejectWithValue(Array.isArray(firstError) ? firstError[0] : firstError);
            }
            return rejectWithValue('Validation failed');

         
          default:
            // Other status codes
            return rejectWithValue(data.message || `Registration failed (${status})`);
        }
      }

      // Network errors or other issues
      if (error.request) {
        // Network error (no response received)
        return rejectWithValue('Network error. Please check your internet connection');
      }

      // Other errors
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error: any) {
      // Handle API errors with better error messages
      if (error.response) {
        const { status, data } = error.response;
        // Handle specific HTTP status codes
        switch (status) {
          case 400:
            // Bad Request - validation errors
            if (data.message) {
              return rejectWithValue(data.message);
            }
            if (data.errors && Array.isArray(data.errors)) {
              return rejectWithValue(data.errors[0].message || 'Invalid login credentials');
            }
            return rejectWithValue('Invalid email or password');

          case 401:
            // Unauthorized
            return rejectWithValue(data.message || 'Invalid email or password');

          case 403:
            // Forbidden
            return rejectWithValue(data.message || 'Account is disabled or access denied');

          case 422:
            // Unprocessable Entity - validation errors
            if (data.message) {
              return rejectWithValue(data.message);
            }
            if (data.errors && typeof data.errors === 'object') {
              const firstError = Object.values(data.errors)[0];
              return rejectWithValue(Array.isArray(firstError) ? firstError[0] : firstError);
            }
            return rejectWithValue('Validation failed');

          case 429:
            // Too Many Requests
            return rejectWithValue('Too many login attempts. Please try again later');

          case 500:
          case 502:
          case 503:
          case 504:
            // Server errors
            return rejectWithValue('Server error. Please try again later');

          default:
            // Other status codes
            return rejectWithValue(data.message || `Login failed (${status})`);
        }
      }

      // Network errors or other issues
      if (error.request) {
        // Network error (no response received)
        return rejectWithValue('Network error. Please check your internet connection');
      }

      // Other errors
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Reset registration success state
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    // Logout user
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.user = action.payload.user || action.payload; // Store user data or success response
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationSuccess = false;
        state.error = action.payload as string || 'Registration failed';
      })
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload; // Store user data
        state.error = null;

        // Store auth token if provided
        if (action.payload.token) {
          // Note: You'll need to implement token storage logic
          // For now, the token would be stored in AsyncStorage in a separate effect
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string || 'Login failed';
      });
  },
});

// Export actions
export const { clearError, resetRegistrationSuccess, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
