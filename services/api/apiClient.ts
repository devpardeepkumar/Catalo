import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base API configuration
const BASE_URL = process.env.API_BASE_URL || 'http://192.168.1.25:3000/api/v1'; // Fallback for development

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common HTTP errors with better logging
    if (error.response) {
      const { status, data, config } = error.response;

      // Log error details for debugging (without sensitive data)
      //console.error(`API Error [${status}]: ${config.method?.toUpperCase()} ${config.url}`);
     // console.error('Status:', status);

      // Only log error message if it exists and isn't too verbose
      if (data?.message && data.message.length < 200) {
        console.error('Error Message:', data.message);
      }

      // Log validation errors in a structured way
      if (data?.errors) {
        console.error('Validation Errors:', data.errors);
      }

    } else if (error.request) {
      // Network error (no response received)
      console.error('Network Error: No response received from server');
      console.error('Request:', error.request);
    } else {
      // Request setup error
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
