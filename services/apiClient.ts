import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { BASE_URL } from '../constants/api'
import { extractApiErrorMessage } from '../utils/handleApiError'

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
      }
    } catch (error) {
      console.error('Token read error:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(extractApiErrorMessage(response.data)))
    }

    return response.data?.data ?? response.data
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('access_token')
        await SecureStore.deleteItemAsync('refresh_token')
      } catch (e) {
        console.error('Token clear error:', e)
      }
    }

    return Promise.reject(
      new Error(extractApiErrorMessage(error, 'Network error. Please check your connection.'))
    )
  }
)

export default apiClient
