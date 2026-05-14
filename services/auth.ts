import api from './api';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

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

interface CompleteProfileResponse {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: string;
    phone: string;
    full_name: string;
    email: string;
    role: 'worker' | 'trader' | 'employer';
    virtual_account_number?: string;
    bank_name?: string;
  };
}

interface LoginRequest {
  phone: string;
  pin: string;
}

interface LoginResponse {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: string;
    phone: string;
    full_name: string;
    email: string;
    role: 'worker' | 'trader' | 'employer';
  };
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
   * POST /auth/complete-profile
   */
  async register(
    data: CompleteProfileRequest
  ): Promise<CompleteProfileResponse> {
    const response = await api.post<CompleteProfileResponse>(
      '/auth/complete-profile',
      {
        ...data,
        phone: this.normalizePhoneNumber(data.phone),
      }
    );

    // Store tokens securely
    const { tokens } = response.data;
    await SecureStore.setItemAsync('access_token', tokens.access);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh);

    return response.data;
  }

  /**
   * Login with phone and PIN
   * POST /auth/login
   */
  async login(phone: string, pin: string): Promise<LoginResponse> {
    console.log('🔐 Auth service - Attempting login with:', { phone: this.normalizePhoneNumber(phone), pin: '****' })
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        phone: this.normalizePhoneNumber(phone),
        pin,
      });

      console.log('✅ Auth service - Login response received:', response.data)

      // Store tokens securely
      const { tokens } = response.data;
      console.log('💾 Auth service - Storing tokens')
      await SecureStore.setItemAsync('access_token', tokens.access);
      await SecureStore.setItemAsync('refresh_token', tokens.refresh);

      console.log('✅ Auth service - Tokens stored successfully')
      return response.data;
    } catch (error: any) {
      console.error('❌ Auth service - Login failed:', error.message)
      
      // Parse standardized error format
      try {
        const parsed = JSON.parse(error.message)
        if (parsed.error?.detail) {
          throw new Error(parsed.error.detail)
        }
      } catch (parseError) {
        // If not JSON, use original message
      }
      
      throw error;
    }
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
   * GET /api/users/auth/profile/
   */
  async getProfile(): Promise<any> {
    const response = await api.get<any>('/api/users/auth/profile/');
    return response.data;
  }

  /**
   * Get current user info
   * GET /api/users/auth/me/
   */
  async getMe(): Promise<any> {
    const response = await api.get<any>('/api/users/auth/me/');
    return response.data;
  }

  /**
   * Update user profile
   * PATCH /api/users/auth/profile/
   */
  async updateProfile(data: Record<string, any>): Promise<any> {
    const response = await api.patch<any>('/api/users/auth/profile/', data);
    return response.data;
  }

  /**
   * Change PIN
   * POST /auth/change-pin
   */
  async changePin(phone: string, old_pin: string, new_pin: string): Promise<any> {
    const response = await api.post<any>('/auth/change-pin', {
      phone: this.normalizePhoneNumber(phone),
      old_pin,
      new_pin,
    });
    return response.data;
  }

  /**
   * Request PIN reset
   * POST /auth/reset-pin/request
   */
  async requestPinReset(phone: string): Promise<any> {
    const response = await api.post<any>('/auth/reset-pin/request', {
      phone: this.normalizePhoneNumber(phone),
    });
    return response.data;
  }

  /**
   * Confirm PIN reset
   * POST /auth/reset-pin/confirm
   */
  async confirmPinReset(phone: string, otp: string, new_pin: string): Promise<any> {
    const response = await api.post<any>('/auth/reset-pin/confirm', {
      phone: this.normalizePhoneNumber(phone),
      otp,
      new_pin,
    });
    return response.data;
  }
}

export const authService = new AuthService();
