import api from './api';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../store/useAppStore';
import { ENDPOINTS } from '../constants/endpoints';
import { NODE_BASE_URL } from '../constants/api';
import axios from 'axios';

interface RequestOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  verified: true;
  phone: string;
}

const nodeApi = axios.create({
  baseURL: NODE_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Re-use same interceptor logic for auth token
nodeApi.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CompleteProfileRequest {
  // Required
  phone: string;
  full_name: string;
  email: string;
  date_of_birth: string; // "YYYY-MM-DD"
  bvn: string; // 11 digits
  pin: string; // 4 digits
  role: 'worker' | 'trader' | 'employer';

  // Optional
  gender?: string;
  address?: string;
  location_area?: string;
  location_city?: string;
  skills?: string[];
  languages?: string[];
  has_vehicle?: boolean;
  vehicle_type?: string;
  availability?: string;
  trade_category?: string;
  market_name?: string;
  weekly_income_range?: string;
  business_name?: string;
}

type AuthResponse = {
  access: string;
  refresh: string;
  id: string;
  phone: string;
  full_name: string;
  role: 'worker' | 'trader' | 'employer';
  squad_account_number?: string;
  squad_bank_name?: string;
  squad_account_status?: string;
  onboarding_complete?: boolean;
}

const persistAuthSession = async (data: AuthResponse) => {
  await SecureStore.setItemAsync('access_token', String(data.access));
  await SecureStore.setItemAsync('refresh_token', String(data.refresh));
  await SecureStore.setItemAsync('user_id', String(data.id));
  await SecureStore.setItemAsync('role', String(data.role));

  if (data.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', String(data.squad_account_number));
  }
  if (data.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', String(data.squad_bank_name));
  }

  useAppStore.getState().setAuthToken(data.access);
  useAppStore.getState().setLoggedIn(true);
  useAppStore.getState().setUser({
    id: data.id,
    phone: data.phone,
    full_name: data.full_name,
    role: data.role,
    squad_account_number: data.squad_account_number,
    squad_bank_name: data.squad_bank_name,
    walletAccountNumber: data.squad_account_number,
    walletBankName: data.squad_bank_name,
    eis_score: (data as any).eis_score ?? (data as any).score ?? 0,
  });
}

class AuthService {
  /**
   * Request OTP for email address
   * POST /auth/request-otp
   */
  async requestOtp(email: string): Promise<RequestOtpResponse> {
    console.log('🔑 Requesting OTP from Node for email:', email);
    const response = await nodeApi.post<RequestOtpResponse>(ENDPOINTS.REQUEST_OTP, {
      email: email.trim().toLowerCase(),
    });
    return response.data;
  }

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    console.log('🔑 Verifying OTP at Node for email:', email);
    const response = await nodeApi.post<VerifyOtpResponse>(ENDPOINTS.VERIFY_OTP, {
      email: email.trim().toLowerCase(),
      otp,
    });
    return response.data;
  }

  /**
   * Complete profile / Register user
   * POST /api/users/auth/register/
   */
  async register(
    data: CompleteProfileRequest
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.REGISTER,
      {
        ...data,
        role: data.role === 'trader' ? 'worker' : data.role,
      }
    );

    const payload = response.data as any;
    const access = payload.access ?? payload.token ?? null;
    const refresh = payload.refresh ?? null;
    const user = payload.user ?? payload;

    const normalized = {
      access,
      refresh,
      id: user.id,
      phone: user.phone,
      full_name: user.full_name,
      role: user.role,
      squad_account_number: user.squad_account_number,
      squad_bank_name: user.squad_bank_name,
    } as AuthResponse;

    await persistAuthSession(normalized);
    return { ...user, access, refresh };
  }

  /**
   * Login with email and PIN
   * POST /api/users/auth/login/
   */
  async login(email: string, pin: string): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, {
        email: email.trim().toLowerCase(),
        pin,
      });

      const payload = response.data as any;
      const access = payload.access ?? payload.token ?? null;
      const refresh = payload.refresh ?? null;
      const user = payload.user ?? payload;

      const normalized = {
        access,
        refresh,
        id: user.id,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role,
        squad_account_number: user.squad_account_number,
        squad_bank_name: user.squad_bank_name,
      } as AuthResponse;

      await persistAuthSession(normalized);
      return { ...user, access, refresh };
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const refresh = await SecureStore.getItemAsync('refresh_token');
      if (refresh) {
        await api.post(ENDPOINTS.LOGOUT, { refresh });
      }
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_id');
      await SecureStore.deleteItemAsync('role');
      useAppStore.getState().resetStore();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('access_token');
    } catch {
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('refresh_token');
    } catch {
      return null;
    }
  }

  /**
  * Normalize Nigerian phone number to international format
  * Accepts: 0801234567, 2348012345678, +2348012345678, 8012345678
  * Returns: +2348012345678
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digits and whitespace
    let cleaned = phoneNumber.trim().replace(/\D/g, '');
    // Normalize to digits-only then convert to international +234 format
    if (!cleaned) return '';

    // If starts with 0 (local), drop leading 0 and prepend 234
    if (cleaned.startsWith('0')) {
      cleaned = `234${cleaned.slice(1)}`;
    }

    // If it's 10 digits without country code, prepend 234
    if (cleaned.length === 10) {
      cleaned = `234${cleaned}`;
    }

    // If it already starts with 234, keep it
    if (!cleaned.startsWith('234')) {
      cleaned = `234${cleaned}`;
    }

    return `+${cleaned}`;
  }

  /**
   * Get current user profile
   * GET /api/auth/profile/
   */
  async getProfile(): Promise<any> {
    const response = await api.get<any>(ENDPOINTS.PROFILE);
    console.log('👤 USER PROFILE DATA:', JSON.stringify(response.data?.data ?? response.data, null, 2));
    return response.data?.data ?? response.data;
  }

  /**
   * Get current user info
   * GET /api/users/auth/me/
   */
  async getMe(): Promise<any> {
    const response = await api.get<any>(ENDPOINTS.ME);
    console.log('👤 USER PROFILE DATA:', JSON.stringify(response.data?.data ?? response.data, null, 2));
    return response.data?.data ?? response.data;
  }

  /**
   * Update user profile
   * PATCH /api/auth/profile/
   */
  async updateProfile(data: Record<string, any>): Promise<any> {
    const response = await api.patch<any>(ENDPOINTS.UPDATE_PROFILE, data);
    return response.data?.data ?? response.data;
  }

  /**
   * Change PIN
   * POST /api/users/auth/change-pin/
   */
  async changePin(phone: string, old_pin: string, new_pin: string): Promise<any> {
    const response = await api.post<any>(ENDPOINTS.CHANGE_PIN, {
      phone: this.normalizePhoneNumber(phone),
      current_pin: old_pin,
      new_pin,
    });
    return response.data?.data ?? response.data;
  }

  /**
   * Request PIN reset
   * POST /api/users/auth/reset-pin/request/
   */
  async requestPinReset(phone: string): Promise<any> {
    const response = await api.post<any>(ENDPOINTS.RESET_PIN_REQUEST, {
      phone: this.normalizePhoneNumber(phone),
    });
    return response.data?.data ?? response.data;
  }

  /**
   * Confirm PIN reset
   * POST /api/users/auth/reset-pin/confirm/
   */
  async confirmPinReset(phone: string, otp: string, new_pin: string): Promise<any> {
    const response = await api.post<any>(ENDPOINTS.RESET_PIN_CONFIRM, {
      phone: this.normalizePhoneNumber(phone),
      otp,
      new_pin,
    });
    return response.data?.data ?? response.data;
  }
}

export const authService = new AuthService();
