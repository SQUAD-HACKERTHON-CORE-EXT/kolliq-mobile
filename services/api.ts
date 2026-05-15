import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../constants/api';
import { ENDPOINTS } from '../constants/endpoints';
import { extractApiErrorMessage } from '../utils/handleApiError';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('access_token');

    // Ensure headers object exists so Authorization is never skipped
    config.headers = (config.headers ?? {}) as any;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 API - Request with token:', config.url);
    } else {
      console.log('📤 API - Request without token:', config.url);
    }

    // Log login payload with masked PIN for debugging
    try {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      if (config.url === ENDPOINTS.LOGIN && data) {
        const masked = {
          ...data,
          pin: data.pin ? `****(${String(data.pin).length})` : undefined,
        };
        console.log('📤 API - Login payload:', masked);
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  } catch (error) {
    console.error('Error fetching auth token:', error);
  }
  return config;
});

/**
 * Response Interceptor:
 * - Keep logging
 * - Do NOT clear tokens on 401.
 *
 * Rationale: Clearing tokens here can break authenticated calls made via apiClient
 * (e.g., employer profile/workers screens) when this generic axios instance
 * encounters a transient 401.
 * Logout/token clearing is handled explicitly by services/authService.ts logout().
 */
api.interceptors.response.use(
  (response) => {
    console.log('📥 API - Response success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('📥 API - Response error:', error.response?.status, error.response?.config?.url)

    // Normalize error message
    const message = extractApiErrorMessage(error, 'An unexpected error occurred')
    console.error('📥 API - Error message:', message)
    return Promise.reject(new Error(message))
  }
);

export default api;
