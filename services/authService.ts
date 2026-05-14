import apiClient from './apiClient'
import * as SecureStore from 'expo-secure-store'
import { ENDPOINTS } from '../constants/endpoints'

export const register = async (data: {
  phone: string
  pin: string
  full_name: string
  role: 'worker' | 'employer' | 'trader'
  gender?: string
  location_city?: string
  location_area?: string
  email?: string
  date_of_birth?: string
  address?: string
  skills?: string[]
  languages?: string[]
  has_vehicle?: boolean
  vehicle_type?: string
  availability?: string
  trade_category?: string
  market_name?: string
  weekly_income_range?: string
  business_name?: string
  bvn?: string
}) => {
  const response = await apiClient.post(ENDPOINTS.REGISTER, {
    ...data,
    channel: 'app',
  })
  const { access, refresh, user } = response.data
  await SecureStore.setItemAsync('access_token', access)
  await SecureStore.setItemAsync('refresh_token', refresh)
  await SecureStore.setItemAsync('user_id', user.id)
  await SecureStore.setItemAsync('role', user.role)
  return response.data
}

export const login = async (phone: string, pin: string) => {
  const response = await apiClient.post(ENDPOINTS.LOGIN, {
    phone,
    pin,
  })
  const { access, refresh, user } = response.data
  await SecureStore.setItemAsync('access_token', access)
  await SecureStore.setItemAsync('refresh_token', refresh)
  await SecureStore.setItemAsync('user_id', user.id)
  await SecureStore.setItemAsync('role', user.role)
  return response.data
}

export const logout = async () => {
  try {
    const refresh = await SecureStore.getItemAsync('refresh_token')
    if (refresh) {
      await apiClient.post(ENDPOINTS.LOGOUT, { refresh })
    }
  } catch (error) {
    console.log('Logout API error:', error)
  } finally {
    await SecureStore.deleteItemAsync('access_token')
    await SecureStore.deleteItemAsync('refresh_token')
    await SecureStore.deleteItemAsync('user_id')
    await SecureStore.deleteItemAsync('role')
  }
}

export const getMe = async () => {
  const response = await apiClient.get(ENDPOINTS.ME)
  return response.data
}

export const getProfile = async () => {
  const response = await apiClient.get(ENDPOINTS.PROFILE)
  return response.data
}

export const updateProfile = async (data: Record<string, any>) => {
  const response = await apiClient.patch(ENDPOINTS.UPDATE_PROFILE, data)
  return response.data
}

export const changePin = async (current_pin: string, new_pin: string) => {
  const response = await apiClient.post(ENDPOINTS.CHANGE_PIN, {
    current_pin,
    new_pin,
  })
  return response.data
}

export const requestPinReset = async (phone: string) => {
  const response = await apiClient.post(ENDPOINTS.RESET_PIN_REQUEST, { phone })
  return response.data
}

export const confirmPinReset = async (
  phone: string,
  otp: string,
  new_pin: string
) => {
  const response = await apiClient.post(ENDPOINTS.RESET_PIN_CONFIRM, {
    phone,
    otp,
    new_pin,
  })
  return response.data
}
