import api from './api';
import * as SecureStore from 'expo-secure-store';
import { User, ApiResponse, OtpResponse, LoginResponse } from '../types';

class AuthService {
  private token: string | null = null;

  /**
   * Request OTP for phone number
   */
  async requestOtp(phoneNumber: string): Promise<OtpResponse> {
    const response = await api.post<ApiResponse<OtpResponse>>(
      '/auth/request-otp',
      { phoneNumber: this.normalizePhoneNumber(phoneNumber) }
    );
    return response.data.data!;
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(
    phoneNumber: string,
    otp: string,
    sessionId: string
  ): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/auth/verify-otp',
      {
        phoneNumber: this.normalizePhoneNumber(phoneNumber),
        otp,
        sessionId,
      }
    );

    const { token, user, wallet } = response.data.data!;

    // Store token securely
    await SecureStore.setItemAsync('authToken', token);
    this.token = token;

    return { token, user, wallet };
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(data: {
    name: string;
    location: string;
    skills: string[];
    languages: string[];
    hasVehicle: boolean;
    availability: string;
    role: 'jobseeker' | 'trader' | 'employer';
  }): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      '/auth/onboarding',
      data
    );
    return response.data.data!;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    const response = await api.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    );
    const token = response.data.data!.token;
    await SecureStore.setItemAsync('authToken', token);
    this.token = token;
    return token;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      '/user/profile',
      updates
    );
    return response.data.data!;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/user/profile');
    return response.data.data!;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('authToken');
      this.token = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    try {
      this.token = await SecureStore.getItemAsync('authToken');
      return this.token;
    } catch {
      return null;
    }
  }

  /**
   * Normalize Nigerian phone number to +234 format
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Handle different input formats
    if (cleaned.startsWith('234')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+234${cleaned.slice(1)}`;
    } else if (cleaned.length === 10) {
      return `+234${cleaned}`;
    }

    return `+${cleaned}`;
  }
}

export const authService = new AuthService();
