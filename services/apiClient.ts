import axios, { AxiosError, AxiosResponse } from 'axios'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://node-middleware.up.railway.app'

// Standardized response format from API spec
interface StandardizedResponse<T = any> {
  success: boolean
  data: T | null
  error: {
    detail: string
  } | null
  code: number
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await SecureStore.getItemAsync('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url)
      } else {
        console.log('📤 API Request (no token):', config.method?.toUpperCase(), config.url)
      }
    } catch (error) {
      console.log('Token read error:', error)
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url, response.data)
    
    // Check if response follows standardized format (has success, data, error, code fields)
    if (typeof response.data === 'object' && response.data !== null) {
      if ('success' in response.data && 'code' in response.data) {
        // Standardized format - pass through
        return response
      }
    }
    
    // If not standardized, wrap it
    return {
      ...response,
      data: {
        success: true,
        data: response.data,
        error: null,
        code: response.status,
      },
    }
  },
  async (error: AxiosError) => {
    console.error('❌ API Error Status:', error.response?.status)
    console.error('❌ API Error URL:', error.config?.url)
    console.error('❌ API Error Response:', JSON.stringify(error.response?.data, null, 2))
    console.error('❌ API Error Message:', error.message)
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('access_token')
        await SecureStore.deleteItemAsync('refresh_token')
        await SecureStore.deleteItemAsync('role')
      } catch (e) {
        console.log('Token clear error:', e)
      }
    }

    // Create standardized error response
    let errorDetail = 'An unexpected error occurred'
    let errorCode = error.response?.status || 500

    if (error.response?.data) {
      const data = error.response.data as any
      // Try to extract error message from various possible formats
      errorDetail =
        data.error?.detail ||
        data.detail ||
        data.message ||
        data.error ||
        JSON.stringify(data) ||
        errorDetail
    } else if (error.message) {
      errorDetail = error.message
    }

    const standardizedError: StandardizedResponse = {
      success: false,
      data: null,
      error: {
        detail: errorDetail,
      },
      code: errorCode,
    }

    const errorWithStandardizedFormat = new Error(JSON.stringify(standardizedError))
    return Promise.reject(errorWithStandardizedFormat)
  }
)

export default apiClient
export type { StandardizedResponse }
