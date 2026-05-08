// User Types
export type UserRole = 'jobseeker' | 'trader' | 'employer';

export interface User {
  id: string;
  phoneNumber: string;
  role?: UserRole;
  name?: string;
  location?: string;
  skills?: string[];
  languages?: string[];
  hasVehicle?: boolean;
  availability?: string;
  economicIdentityScore?: number;
  walletBalance?: number;
  walletAccountNumber?: string;
  createdAt?: string;
  bvnVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  pay: number;
  duration?: string;
  location: string;
  distance?: number;
  employerId: string;
  employerName: string;
  employerRating: number;
  skills: string[];
  languages?: string[];
  requiredAvailability?: string;
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
  acceptedBy?: string;
}

export interface JobMatch {
  job: Job;
  matchScore: number;
  reasons: string[];
}

// Wallet & Transaction Types
export interface Wallet {
  accountNumber: string;
  balance: number;
  currency: string;
  userId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: string;
  relatedJobId?: string;
  reference?: string;
}

// Financial Services
export interface MicroLoan {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'active' | 'repaid' | 'defaulted';
  disbursedAt: string;
  dueDate: string;
  amountRepaid: number;
}

export interface Insurance {
  id: string;
  userId: string;
  type: 'trade' | 'health' | 'income';
  premium: number;
  coverage: number;
  status: 'active' | 'inactive' | 'claimed';
  startDate: string;
  endDate: string;
}

export interface Savings {
  id: string;
  userId: string;
  dailyAmount: number;
  totalSaved: number;
  status: 'active' | 'inactive';
  startDate: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OtpResponse {
  sessionId: string;
  expiresIn: number;
}

export interface LoginResponse {
  token: string;
  user: User;
  wallet: Wallet;
}
