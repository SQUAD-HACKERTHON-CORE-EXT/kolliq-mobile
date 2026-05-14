import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: string
  phone: string
  full_name: string
  role: 'worker' | 'employer' | 'trader'
  squad_account_number?: string
  squad_bank_name?: string
  walletAccountNumber?: string
  walletBankName?: string
  email?: string
  location_city?: string
  skills?: string[]
  eis_score?: number
  gender?: string
  availability?: string
  has_vehicle?: boolean
  vehicle_type?: string
  trade_category?: string
  market_name?: string
  business_name?: string
}

interface Wallet {
  account_number: string
  account_name: string
  bank_name: string
  balance: string
  escrow_balance: string
  savings_balance: string
  wallet_ready: boolean
}

interface Job {
  id: string
  title: string
  pay_per_worker: string
  location_area: string
  match_score?: number
  distance_km?: number
  employer_rating?: number
  description?: string
  workers_needed?: number
  status?: string
  escrow_funded?: boolean
}

interface Transaction {
  id: string
  amount: string
  transaction_type: 'credit' | 'debit'
  status: string
  description: string
  created_at: string
}

interface LoanEligibility {
  eligible: boolean
  max_amount: number
  interest_rate: number
  tenure_days: number
  funding_source: string
  note?: string
  reason?: string
}

interface Insurance {
  unlocked: boolean
  active: boolean
  premium_per_day?: string
  coverage_limit?: string
  paused?: boolean
}

interface Savings {
  unlocked: boolean
  balance: string
  total_interest_earned: string
  annual_interest_rate: number
  wallet_balance: string
}

interface OnboardingData {
  // All users
  phone?: string
  pin?: string
  full_name?: string
  role?: 'worker' | 'employer' | 'trader'
  gender?: string
  location_area?: string
  location_city?: string
  languages?: string[]

  // Worker specific
  skills?: string[]
  availability?: string
  has_vehicle?: boolean
  vehicle_type?: string

  // Trader specific
  trade_category?: string[]
  business_name?: string
  market_name?: string
  weekly_income_range?: string

  // Employer specific
  worker_types_needed?: string[]
  hiring_frequency?: string
  typical_pay_per_day?: string
  team_size?: string
}

interface AppState {
  // Auth
  isLoggedIn: boolean
  isLoading: boolean
  authToken: string | null

  // User
  user: User | null
  eisScore: number

  // Wallet
  wallet: Wallet | null
  walletLoading: boolean

  // Financial unlock thresholds
  savingsUnlocked: boolean
  loansUnlocked: boolean
  insuranceUnlocked: boolean

  // Jobs
  jobsFeed: Job[]
  myJobs: any[]
  jobsLoading: boolean

  // Transactions
  transactions: Transaction[]
  transactionsLoading: boolean

  // Financial data
  loanEligibility: LoanEligibility | null
  activeLoans: any[]
  insurance: Insurance | null
  savings: Savings | null

  // Onboarding temp storage
  onboardingData: Partial<OnboardingData>

  // Marketplace
  listings: any[]
  myListings: any[]
  categories: any[]

  // Actions — Auth
  setLoggedIn: (value: boolean) => void
  setLoading: (value: boolean) => void
  setAuthToken: (token: string) => void

  // Actions — User
  setUser: (user: User) => void
  setEisScore: (score: number) => void
  clearUser: () => void

  // Actions — Wallet
  setWallet: (wallet: Wallet) => void
  setWalletLoading: (value: boolean) => void
  updateWalletBalance: (balance: string) => void

  // Actions — Jobs
  setJobsFeed: (jobs: Job[]) => void
  setMyJobs: (jobs: any[]) => void
  setJobsLoading: (value: boolean) => void

  // Actions — Transactions
  setTransactions: (transactions: Transaction[]) => void
  setTransactionsLoading: (value: boolean) => void

  // Actions — Financial
  setLoanEligibility: (data: LoanEligibility) => void
  setActiveLoans: (loans: any[]) => void
  setInsurance: (data: Insurance) => void
  setSavings: (data: Savings) => void

  // Actions — Onboarding
  setOnboardingData: (data: Partial<OnboardingData>) => void
  clearOnboardingData: () => void

  // Actions — Marketplace
  setListings: (listings: any[]) => void
  setMyListings: (listings: any[]) => void
  setCategories: (categories: any[]) => void

  // Actions — Full reset
  resetStore: () => void

  // Async Actions
  loadUserFromStorage: () => Promise<void>
}

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  authToken: null,
  user: null,
  eisScore: 0,
  wallet: null,
  walletLoading: false,
  savingsUnlocked: false,
  loansUnlocked: false,
  insuranceUnlocked: false,
  jobsFeed: [],
  myJobs: [],
  jobsLoading: false,
  transactions: [],
  transactionsLoading: false,
  loanEligibility: null,
  activeLoans: [],
  insurance: null,
  savings: null,
  onboardingData: {},
  listings: [],
  myListings: [],
  categories: [],
}

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setLoggedIn: (value) => set({ isLoggedIn: value }),
  setLoading: (value) => set({ isLoading: value }),
  setAuthToken: (token) => set({ authToken: token }),

  setUser: (user) =>
    set({
      user,
      isLoggedIn: true,
      eisScore: user.eis_score || 0,
      savingsUnlocked: (user.eis_score || 0) >= 20,
      loansUnlocked: (user.eis_score || 0) >= 50,
      insuranceUnlocked: (user.eis_score || 0) >= 70,
    }),

  setEisScore: (score) =>
    set({
      eisScore: score,
      savingsUnlocked: score >= 20,
      loansUnlocked: score >= 50,
      insuranceUnlocked: score >= 70,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
      authToken: null,
      eisScore: 0,
      savingsUnlocked: false,
      loansUnlocked: false,
      insuranceUnlocked: false,
    }),

  setWallet: (wallet) => set({ wallet, walletLoading: false }),
  setWalletLoading: (value) => set({ walletLoading: value }),
  updateWalletBalance: (balance) =>
    set((state) => ({
      wallet: state.wallet ? { ...state.wallet, balance } : null,
    })),

  setJobsFeed: (jobs) => set({ jobsFeed: jobs, jobsLoading: false }),
  setMyJobs: (jobs) => set({ myJobs: jobs }),
  setJobsLoading: (value) => set({ jobsLoading: value }),

  setTransactions: (transactions) =>
    set({ transactions, transactionsLoading: false }),
  setTransactionsLoading: (value) =>
    set({ transactionsLoading: value }),

  setLoanEligibility: (data) => set({ loanEligibility: data }),
  setActiveLoans: (loans) => set({ activeLoans: loans }),
  setInsurance: (data) => set({ insurance: data }),
  setSavings: (data) => set({ savings: data }),

  setOnboardingData: (data) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data },
    })),
  clearOnboardingData: () => set({ onboardingData: {} }),

  setListings: (listings) => set({ listings }),
  setMyListings: (listings) => set({ myListings: listings }),
  setCategories: (categories) => set({ categories }),

  resetStore: () => set(initialState),

  loadUserFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token')
      const role = await SecureStore.getItemAsync('role')
      const userId = await SecureStore.getItemAsync('user_id')
      if (token && role && userId) {
        set({
          authToken: token,
          isLoggedIn: true,
        })
      }
    } catch (error) {
      console.log('Load from storage error:', error)
    }
  },
}))
