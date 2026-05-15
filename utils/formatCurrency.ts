/**
 * Format naira currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency without symbol (for display purposes)
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Parse Nigerian phone number
 */
export const parsePhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`;
  } else if (cleaned.length === 10) {
    return `+234${cleaned}`;
  }

  return `+${cleaned}`;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const parsed = parsePhoneNumber(phone);
  // Format as: +234 801 234 5678
  return parsed.replace(/(\+234)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
};

/**
 * Validate Nigerian phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  // Must be 11 digits (starting with 0) or 13 (starting with +234)
  return cleaned.length === 11 || cleaned.length === 13;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate OTP (numeric, typically 4-6 digits)
 */
export const isValidOtp = (otp: string, length: number = 4): boolean => {
  return /^\d+$/.test(otp) && otp.length >= length && otp.length <= 6;
};
