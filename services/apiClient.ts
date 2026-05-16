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

/**
 * IMPORTANT DEBUG NOTE:
 * Some employer screens still hit 401 even when the app appears logged in.
 * We add safe debug logs to confirm whether:
 *  - apiClient interceptor runs
 *  - SecureStore has access_token at request-time
 *  - Authorization header is being set
 *
 * Also: avoid deleting tokens inside apiClient on 401 while debugging,
 * because it can cause a cascade (first 401 clears token, then other calls fail).
 */

apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await SecureStore.getItemAsync('access_token')
      const url = config?.url ?? '(unknown-url)'

      // Debug: token existence only (don’t log the token)
      console.log('apiClient request:', {
        url,
        hasToken: Boolean(token),
        tokenLength: token ? String(token).length : 0,
      })

      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('apiClient Token read error:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API RESPONSE [${response.config.url}]:`, JSON.stringify(response.data?.data ?? response.data, null, 2));
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(extractApiErrorMessage(response.data)))
    }
    return response.data?.data ?? response.data
  },
  async (error: any) => {
    const status = error?.response?.status
    const url = error?.config?.url ?? '(unknown-url)'

    console.log('apiClient response error:', {
      url,
      status,
      details: JSON.stringify(error?.response?.data, null, 2),
    })

    // Reject with the raw axios error object (not `new Error(...)`).
    //
    // If we do `Promise.reject(new Error(extractApiErrorMessage(error)))`:
    //   - The new Error has no .response property
    //   - `handleApiError` receives: error?.response?.data → undefined
    //   - `handleApiError` falls all the way to `error?.message = "[object Object]"` or fallback
    //   - Key detail strings like '"nip_code" length must be 6' reach the formatter's
    //     `error?.message` path (error.response → response → new Error(message) ❌)
    //
    // By rejecting with `error` itself:
    //   - `handleApiError` receives: error?.response?.data = { detail: '"nip_code"...' }
    //   - `handleApiError` hits `details?.detail` immediately ✓
    //   - Downstream catch blocks see `error.response.data.detail`
    //     and can branch on `'nip_code' in detail` ✓
    //
    // Token clearing is handled explicitly by services/authService.ts logout() —
    // do NOT clear tokens here to avoid cascading 401 on other calls.
    return Promise.reject(error)
  }
)

export default apiClient
