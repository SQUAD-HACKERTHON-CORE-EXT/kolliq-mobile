import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants';
import { User, ApiResponse, OtpResponse, LoginResponse } from '../types';

class AuthService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(async (config) => {
      const token = await this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Request OTP for phone number
   */
  async requestOtp(phoneNumber: string): Promise<OtpResponse> {
    try {
      const response = await this.api.post<ApiResponse<OtpResponse>>(
        '/auth/request-otp',
        { phoneNumber: this.normalizePhoneNumber(phoneNumber) }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(
    phoneNumber: string,
    otp: string,
    sessionId: string
  ): Promise<LoginResponse> {
    try {
      const response = await this.api.post<ApiResponse<LoginResponse>>(
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
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<ApiResponse<User>>(
        '/auth/onboarding',
        data
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await this.api.post<ApiResponse<{ token: string }>>(
        '/auth/refresh'
      );
      const token = response.data.data!.token;
      await SecureStore.setItemAsync('authToken', token);
      this.token = token;
      return token;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await this.api.put<ApiResponse<User>>(
        '/user/profile',
        updates
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<ApiResponse<User>>('/user/profile');
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
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

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'An error occurred. Please try again.';
      return new Error(message);
    }
    return error;
  }
}

export const authService = new AuthService();
