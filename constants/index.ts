export const COLORS = {
  // Brand DNA
  primary: '#1B4D3E',      // Forest Green
  accent: '#F4721E',       // Energy Orange
  background: '#F5F5F0',   // Off White
  
  // UI Surfaces
  surface: '#FFFFFF',      // White for cards
  surfaceAlt: '#F5F5F0',   // Match background
  inputBg: '#F5F5F0',      // Input background
  inputBorder: '#E0E0D8',  // Input border
  border: '#E0E0D8',       // Alias for backward compatibility
  borderDark: '#D4D4D0',
  
  // Selection States
  selectedBg: '#EAF5EF',   // Light green for selected states
  selectedBorder: '#1B4D3E',
  
  // Typography
  text: '#1A1A18',         // Near Black
  textSecondary: '#888880', // Muted Gray
  textMuted: '#888880',    // Alias
  white: '#FFFFFF',
  black: '#000000',
  
  // Status
  inactive: '#B0B0A8',
  error: '#EF4444',
  warning: '#F4721E',      // Using accent for warning
  secondary: '#1B4D3E',    // Defaulting to primary
  success: '#1B4D3E',
  info: '#1B4D3E',
  
  // Legacy/Compatibility
  primaryLight: '#EAF5EF',
  primaryDark: '#1B4D3E',
  primaryMuted: 'rgba(27, 77, 62, 0.1)',
  secondaryLight: '#EAF5EF',
  secondaryDark: '#1B4D3E',
  secondaryMuted: 'rgba(27, 77, 62, 0.1)',
  escrowBg: '#EAF5EF',
  matchBg: '#F5F5F0',
  badgeGreen: '#EAF5EF',
};

export const FONTS = {
  family: 'PlusJakartaSans',
  sizes: {
    xs: 12,
    sm: 12,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 26,
    '3xl': 34,
    '4xl': 36,
    // Brand Semantic Keys
    hero: 36,
    title: 26,
    cardTitle: 17,
    body: 15,
    label: 12,
    hint: 11,
    subtext: 14,
    small: 10,
    logo: 18,
  },
  weights: {
    regular: 'PlusJakartaSans_400Regular' as const,
    medium: 'PlusJakartaSans_500Medium' as const,
    semibold: 'PlusJakartaSans_600SemiBold' as const,
    bold: 'PlusJakartaSans_700Bold' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const BORDER_RADIUS = {
  input: 12,
  card: 16,
  button: 14,
  pill: 99,
  // Compatibility Scale
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14, // Mapping to button radius
  xl: 16, // Mapping to card radius
  '2xl': 24,
  full: 99,
};

export const LAYOUT = {
  paddingHorizontal: 16,
  paddingHorizontalLarge: 24,
  buttonHeight: 54,
  inputHeight: 54,
};

import { BASE_URL } from './api';

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 30000,
};

export const ONBOARDING_CONFIG = {
  STEPS: [
    { id: 'name', title: "What's your name?", subtitle: "Use your real name for payment verification" },
    { id: 'location', title: "Where are you located?", subtitle: "We'll show you jobs in your area" },
    { id: 'skills', title: "What can you do?", subtitle: "Select your primary skills" },
    { id: 'languages', title: "Languages you speak?", subtitle: "Helps us match you with employers" },
    { id: 'vehicle', title: "Do you have a bike or car?", subtitle: "Important for delivery & dispatch roles" },
    { id: 'availability', title: "When are you available?", subtitle: "Choose your preferred shifts" },
  ],
  SKILLS: ['Delivery', 'Cooking', 'Construction', 'Cleaning', 'Security', 'Teaching', 'Market Assistant'],
  LANGUAGES: ['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'],
  AVAILABILITY: ['Mornings', 'Afternoons', 'Evenings', 'Full Time'],
};

export const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP sent to your phone number.',
  LOGIN_SUCCESS: 'Welcome to Kolliq!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  JOB_ACCEPTED: 'Job accepted successfully.',
  PAYMENT_RECEIVED: 'Payment received!',
};

export const BUSINESS_RULES = {
  INITIAL_EIS_SCORE: 10,
  MAX_EIS_SCORE: 100,
  LOAN_UNLOCK_SCORE: 50,
  SAVINGS_UNLOCK_DAYS: 7,
  LOAN_UNLOCK_DAYS: 30,
  INSURANCE_UNLOCK_DAYS: 60,
};
