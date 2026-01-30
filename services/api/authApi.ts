import { RegistrationFormData } from '@/types/authType';
import apiClient from './apiClient';

// Types for profile operations
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sex?: string | null;
  dateOfBirth?: string;
  isEmailVerified?: boolean;
  role?: string;
}

// API response structure for /auth/me
export interface AuthMeResponse {
  data: {
    user: UserProfile;
  };
  sex: null;
  success: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  sex?: string;
}

// Auth API service functions
export const authApi = {
  // Register a new user
  register: async (userData: RegistrationFormData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user (for future use)
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Get current authenticated user (me)
  getMe: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData): Promise<UserProfile> => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  // Forgot password (for future use)
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify email (for future use)
  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },
};
