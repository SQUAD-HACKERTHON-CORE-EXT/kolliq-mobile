import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants';

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 API - Request with token:', config.url)
    } else {
      console.log('📤 API - Request without token:', config.url)
    }
  } catch (error) {
    console.error('Error fetching auth token:', error);
  }
  return config;
});

// Response Interceptor: Handle Errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    console.log('📥 API - Response success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('📥 API - Response error:', error.response?.status, error.response?.config?.url)
    if (error.response?.status === 401) {
      // Handle logout or token refresh logic here
      console.warn('Unauthorized! Logging out...');
      SecureStore.deleteItemAsync('access_token');
      SecureStore.deleteItemAsync('refresh_token');
    }
    
    // Normalize error message
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('📥 API - Error message:', message)
    return Promise.reject(new Error(message));
  }
);

export default api;
