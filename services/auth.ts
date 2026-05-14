import api from './api';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../store/useAppStore';

interface RequestOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  verified: true;
  phone: string;
}

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
  await SecureStore.setItemAsync('access_token', data.access);
  await SecureStore.setItemAsync('refresh_token', data.refresh);
  await SecureStore.setItemAsync('user_id', data.id);
  await SecureStore.setItemAsync('role', data.role);

  if (data.squad_account_number) {
    await SecureStore.setItemAsync('squad_account_number', data.squad_account_number);
  }
  if (data.squad_bank_name) {
    await SecureStore.setItemAsync('squad_bank_name', data.squad_bank_name);
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
    eis_score: 0,
  });
}

class AuthService {
  /**
   * Request OTP for phone number
   * POST /auth/request-otp
   */
  async requestOtp(phone: string): Promise<RequestOtpResponse> {
    const response = await api.post<RequestOtpResponse>('/auth/request-otp', {
      phone: this.normalizePhoneNumber(phone),
    });
    return response.data;
  }

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', {
      phone: this.normalizePhoneNumber(phone),
      otp,
    });
    return response.data;
  }

  /**
   * Complete profile / Register user
    * POST /api/auth/register/
   */
  async register(
    data: CompleteProfileRequest
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/api/auth/register/',
      {
        ...data,
        phone: this.normalizePhoneNumber(data.phone),
        role: data.role === 'trader' ? 'worker' : data.role,
      }
    );

    await persistAuthSession(response.data);
    return response.data;
  }

  /**
   * Login with phone and PIN
    * POST /api/auth/login/
   */
  async login(phone: string, pin: string): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>('/api/auth/login/', {
        phone: this.normalizePhoneNumber(phone),
        pin,
      });

      await persistAuthSession(response.data);
      return response.data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
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
   * Normalize Nigerian phone number to standard format
   * Accepts: 0801234567, 2348012345678, +2348012345678, 8012345678
   * Returns: 2348012345678
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digits and whitespace
    let cleaned = phoneNumber.trim().replace(/\D/g, '');

    // Handle different input formats
    if (cleaned.startsWith('234')) {
      // Already in 234 format
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      // Starts with 0, replace with 234
      return `234${cleaned.slice(1)}`;
    } else if (cleaned.length === 10) {
      // 10 digits without country code
      return `234${cleaned}`;
    }

    // Default: prepend 234
    return `234${cleaned}`;
  }

  /**
   * Get current user profile
   * GET /api/auth/profile/
   */
  async getProfile(): Promise<any> {
    const response = await api.get<any>('/api/auth/profile/');
    return response.data?.data ?? response.data;
  }

  /**
   * Get current user info
   * GET /api/auth/me/
   */
  async getMe(): Promise<any> {
    const response = await api.get<any>('/api/auth/me/');
    return response.data?.data ?? response.data;
  }

  /**
   * Update user profile
   * PATCH /api/auth/profile/
   */
  async updateProfile(data: Record<string, any>): Promise<any> {
    const response = await api.patch<any>('/api/auth/profile/', data);
    return response.data?.data ?? response.data;
  }

  /**
   * Change PIN
   * POST /api/auth/change-pin/
   */
  async changePin(phone: string, old_pin: string, new_pin: string): Promise<any> {
    const response = await api.post<any>('/api/auth/change-pin/', {
      phone: this.normalizePhoneNumber(phone),
      current_pin: old_pin,
      new_pin,
    });
    return response.data?.data ?? response.data;
  }

  /**
   * Request PIN reset
   * POST /api/auth/reset-pin/request/
   */
  async requestPinReset(phone: string): Promise<any> {
    const response = await api.post<any>('/api/auth/reset-pin/request/', {
      phone: this.normalizePhoneNumber(phone),
    });
    return response.data?.data ?? response.data;
  }

  /**
   * Confirm PIN reset
   * POST /api/auth/reset-pin/confirm/
   */
  async confirmPinReset(phone: string, otp: string, new_pin: string): Promise<any> {
    const response = await api.post<any>('/api/auth/reset-pin/confirm/', {
      phone: this.normalizePhoneNumber(phone),
      otp,
      new_pin,
    });
    return response.data?.data ?? response.data;
  }
}

export const authService = new AuthService();
