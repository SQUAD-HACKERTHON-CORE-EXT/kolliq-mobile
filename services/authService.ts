import api from './api'
import apiClient from './apiClient'
import * as SecureStore from 'expo-secure-store'
import { ENDPOINTS } from '../constants/endpoints'
import { useAppStore } from '../store/useAppStore'

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
  const response = await api.post(ENDPOINTS.REGISTER, {
    ...data,
    role: data.role === 'trader' ? 'worker' : data.role,
    channel: 'app',
  })
  const payload = response.data
  await SecureStore.setItemAsync('access_token', payload.access)
  await SecureStore.setItemAsync('refresh_token', payload.refresh)
  await SecureStore.setItemAsync('user_id', payload.id)
  await SecureStore.setItemAsync('role', payload.role)
  if (payload.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', payload.squad_account_number)
  }
  if (payload.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', payload.squad_bank_name)
  }
  useAppStore.getState().setAuthToken(payload.access)
  useAppStore.getState().setLoggedIn(true)
  useAppStore.getState().setUser({
    id: payload.id,
    phone: payload.phone,
    full_name: payload.full_name,
    role: payload.role,
    squad_account_number: payload.squad_account_number,
    squad_bank_name: payload.squad_bank_name,
    walletAccountNumber: payload.squad_account_number,
    walletBankName: payload.squad_bank_name,
    eis_score: 0,
  })
  return payload
}

export const login = async (phone: string, pin: string) => {
  const response = await api.post(ENDPOINTS.LOGIN, {
    phone,
    pin,
  })
  const payload = response.data
  await SecureStore.setItemAsync('access_token', payload.access)
  await SecureStore.setItemAsync('refresh_token', payload.refresh)
  await SecureStore.setItemAsync('user_id', payload.id)
  await SecureStore.setItemAsync('role', payload.role)
  if (payload.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', payload.squad_account_number)
  }
  if (payload.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', payload.squad_bank_name)
  }
  useAppStore.getState().setAuthToken(payload.access)
  useAppStore.getState().setLoggedIn(true)
  useAppStore.getState().setUser({
    id: payload.id,
    phone: payload.phone,
    full_name: payload.full_name,
    role: payload.role,
    squad_account_number: payload.squad_account_number,
    squad_bank_name: payload.squad_bank_name,
    walletAccountNumber: payload.squad_account_number,
    walletBankName: payload.squad_bank_name,
    eis_score: 0,
  })
  return payload
}

export const logout = async () => {
  try {
    const refresh = await SecureStore.getItemAsync('refresh_token')
    if (refresh) {
      await api.post(ENDPOINTS.LOGOUT, { refresh })
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
  return await apiClient.get(ENDPOINTS.ME)
}

export const getProfile = async () => {
  return await apiClient.get(ENDPOINTS.PROFILE)
}

export const updateProfile = async (data: Record<string, any>) => {
  return await apiClient.patch(ENDPOINTS.UPDATE_PROFILE, data)
}

export const changePin = async (current_pin: string, new_pin: string) => {
  return await apiClient.post(ENDPOINTS.CHANGE_PIN, {
    current_pin,
    new_pin,
  })
}

export const requestPinReset = async (phone: string) => {
  return await apiClient.post(ENDPOINTS.RESET_PIN_REQUEST, { phone })
}

export const confirmPinReset = async (
  phone: string,
  otp: string,
  new_pin: string
) => {
  return await apiClient.post(ENDPOINTS.RESET_PIN_CONFIRM, {
    phone,
    otp,
    new_pin,
  })
}
