// Konnect Brand Colors
export const COLORS = {
  primary: '#4F46E5', // Indigo - main brand color
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  secondary: '#10B981', // Emerald - success/money
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  accent: '#F59E0B', // Amber - warnings/scores
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Contextual
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Gradients (used in styles)
  gradientPrimary: ['#4F46E5', '#6366F1'],
  gradientSuccess: ['#10B981', '#34D399'],
};

// Typography
export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

// API Config
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.konnect.ng',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Feature Flags
export const FEATURES = {
  USSD_ENABLED: true,
  BIOMETRIC_AUTH: true,
  PAYMENT_ESCROW: true,
  AI_MATCHING: true,
  INSURANCE_ENABLED: true,
  LOAN_ENABLED: true,
  SAVINGS_ENABLED: true,
};

// Business Rules
export const BUSINESS_RULES = {
  INITIAL_EIS_SCORE: 10,
  MAX_EIS_SCORE: 100,
  
  // Days before services unlock
  SAVINGS_UNLOCK_DAYS: 7,
  LOAN_UNLOCK_DAYS: 30,
  INSURANCE_UNLOCK_DAYS: 45,
  
  // Fees (in percentage)
  PLATFORM_FEE_PERCENT: 5, // 5% of gig payments
  LOAN_FACILITATION_FEE_PERCENT: 2.5,
  INSURANCE_ADMIN_FEE_PERCENT: 15,
  
  // Loan defaults
  LOAN_INTEREST_RATE_MONTHLY: 5, // 5% monthly
  LOAN_REPAYMENT_WEEKS: 4,
  
  // Insurance
  INSURANCE_PREMIUM_MIN: 100, // naira per day
  INSURANCE_PREMIUM_MAX: 300,
  INSURANCE_SMALL_CLAIM_THRESHOLD: 10000,
  INSURANCE_AUTO_APPROVAL_HOURS: 2,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  INVALID_OTP: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  INVALID_PHONE: 'Please enter a valid Nigerian phone number.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again later.',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP sent to your phone number.',
  LOGIN_SUCCESS: 'Welcome to Konnect!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  JOB_ACCEPTED: 'Job accepted successfully.',
  PAYMENT_RECEIVED: 'Payment received!',
  LOAN_APPROVED: 'Loan approved!',
  INSURANCE_ACTIVATED: 'Insurance activated successfully.',
};
