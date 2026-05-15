import api from './api'
import apiClient from './apiClient'
import * as SecureStore from 'expo-secure-store'
import { ENDPOINTS } from '../constants/endpoints'
import { useAppStore } from '../store/useAppStore'

const normalizePhone = (phone: string) => {
  if (!phone) return phone
  let p = phone.trim()
  // Remove any leading + for normalization then re-add
  if (p.startsWith('+')) p = p.slice(1)
  // If local format starts with 0 => convert to international NG (234)
  if (p.startsWith('0')) p = `234${p.slice(1)}`
  // If user entered 10-digit without leading zero
  if (!p.startsWith('234') && p.length === 10) p = `234${p}`
  // Ensure leading + for API contract
  return `+${p}`
}

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
  // API may return { access, refresh, user } or a flattened payload — normalize
  const access = payload.access ?? payload.token ?? null
  const refresh = payload.refresh ?? null
  const user = payload.user ?? payload

  if (access) await SecureStore.setItemAsync('access_token', String(access))
  if (refresh) await SecureStore.setItemAsync('refresh_token', String(refresh))
  if (user?.id) await SecureStore.setItemAsync('user_id', String(user.id))
  if (user?.role) await SecureStore.setItemAsync('role', String(user.role))
  if (user?.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', String(user.squad_account_number))
  }
  if (user?.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', String(user.squad_bank_name))
  }

  useAppStore.getState().setAuthToken(access)
  useAppStore.getState().setLoggedIn(true)
  useAppStore.getState().setUser({
    id: user.id,
    phone: user.phone,
    full_name: user.full_name,
    role: user.role,
    squad_account_number: user.squad_account_number,
    squad_bank_name: user.squad_bank_name,
    walletAccountNumber: user.squad_account_number,
    walletBankName: user.squad_bank_name,
    eis_score: user.eis_score ?? 0,
  })

  return { ...user, access, refresh }
}

export const login = async (phone: string, pin: string) => {
  const payloadPhone = normalizePhone(phone)
  console.log('📤 Login payload:', { phone: payloadPhone, pinLength: pin.length })
  const response = await api.post(ENDPOINTS.LOGIN, {
    phone: payloadPhone,
    pin,
  })
  const payload = response.data
  const access = payload.access ?? payload.token ?? null
  const refresh = payload.refresh ?? null
  const user = payload.user ?? payload

  if (access) await SecureStore.setItemAsync('access_token', String(access))
  if (refresh) await SecureStore.setItemAsync('refresh_token', String(refresh))
  if (user?.id) await SecureStore.setItemAsync('user_id', String(user.id))
  if (user?.role) await SecureStore.setItemAsync('role', String(user.role))
  if (user?.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', String(user.squad_account_number))
  }
  if (user?.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', String(user.squad_bank_name))
  }

  useAppStore.getState().setAuthToken(access)
  useAppStore.getState().setLoggedIn(true)
  useAppStore.getState().setUser({
    id: user.id,
    phone: user.phone,
    full_name: user.full_name,
    role: user.role,
    squad_account_number: user.squad_account_number,
    squad_bank_name: user.squad_bank_name,
    walletAccountNumber: user.squad_account_number,
    walletBankName: user.squad_bank_name,
    eis_score: user.eis_score ?? 0,
  })

  return { ...user, access, refresh }
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
    useAppStore.getState().resetStore()
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
  return await apiClient.post(ENDPOINTS.RESET_PIN_REQUEST, { phone: normalizePhone(phone) })
}

export const confirmPinReset = async (
  phone: string,
  otp: string,
  new_pin: string
) => {
  return await apiClient.post(ENDPOINTS.RESET_PIN_CONFIRM, {
    phone: normalizePhone(phone),
    otp,
    new_pin,
  })
}
