export const API_ENDPOINTS = {
  BASE_URL: 'http://192.168.1.36:3000/api/v1/auth',
  AUTH: {
    FORGOT_PASSWORD: '/forgot-password',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',
  },
  // Add other API endpoints as needed
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};
