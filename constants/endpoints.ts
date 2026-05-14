export const ENDPOINTS = {
  // Auth endpoints - Node.js middleware
  REQUEST_OTP: '/auth/request-otp',
  VERIFY_OTP: '/auth/verify-otp',
  REGISTER: '/auth/complete-profile',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CHANGE_PIN: '/auth/change-pin',
  RESET_PIN_REQUEST: '/auth/reset-pin/request',
  RESET_PIN_CONFIRM: '/auth/reset-pin/confirm',
  
  // User profile - Django via middleware
  ME: '/api/users/auth/me/',
  PROFILE: '/api/users/auth/profile/',
  UPDATE_PROFILE: '/api/users/auth/profile/',
  
  // Wallet - Django via middleware
  WALLET: '/api/wallets/',
  BANKS: '/api/wallets/banks/',
  BANK_ACCOUNT: '/api/wallets/bank-account/',
  VERIFY_BANK: '/api/wallets/bank-account/verify/',
  SAVE_BANK: '/api/wallets/bank-account/save/',
  
  // Jobs - Django via middleware
  JOBS_FEED: '/api/jobs/feed/',
  CREATE_JOB: '/api/jobs/create/',
  ACCEPT_JOB: '/api/jobs/accept/',
  COMPLETE_JOB: '/api/jobs/complete/',
  MY_JOBS: '/api/jobs/mine/',
  RATE_JOB: '/api/jobs/rate/',
  
  // Payments - Django via middleware
  TRANSACTIONS: '/api/payments/transactions/',
  
  // Financial - Django via middleware
  SAVINGS: '/api/financial/savings/',
  SAVINGS_DEPOSIT: '/api/financial/savings/deposit/',
  SAVINGS_WITHDRAW: '/api/financial/savings/withdraw/',
  LOANS: '/api/financial/loans/',
  LOAN_ELIGIBILITY: '/api/financial/loans/eligibility/',
  LOAN_APPLY: '/api/financial/loans/apply/',
  LOAN_REPAY: '/api/financial/loans/repay/',
  INSURANCE: '/api/financial/insurance/',
  INSURANCE_ACTIVATE: '/api/financial/insurance/activate/',
  INSURANCE_CLAIM: '/api/financial/insurance/claim/',
  INSURANCE_CLAIMS: '/api/financial/insurance/claims/',
  
  // Marketplace - Django via middleware
  CATEGORIES: '/api/marketplace/categories/',
  LISTINGS: '/api/marketplace/listings/',
  MY_LISTINGS: '/api/marketplace/listings/mine/',
  SAVED_LISTINGS: '/api/marketplace/listings/saved/',
  CREATE_LISTING: '/api/marketplace/listings/create/',
  
  // Health
  HEALTH: '/api/health/',
}
