import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

const toNumber = (value: any, fallback = 0) => {
  const parsed = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const unwrap = (response: any, keys: string[] = []) => {
  if (!response) return response
  if (Array.isArray(response)) return response

  for (const key of keys) {
    if (response?.[key] !== undefined) return response[key]
  }

  return response?.data ?? response
}

const normalizeLoanEligibility = (data: any) => ({
  eligible: Boolean(data?.eligible ?? data?.is_eligible ?? data?.available ?? false),
  score: toNumber(data?.score ?? 0),
  max_amount: toNumber(data?.max_amount ?? data?.amount ?? data?.limit ?? 0),
  interest_rate: toNumber(data?.interest_rate ?? data?.rate ?? 0),
  tenure_days: toNumber(data?.tenure_days ?? data?.tenure ?? 0),
  funding_source: data?.funding_source ?? data?.source ?? 'Squad',
  note: data?.note ?? data?.message,
  reason: data?.reason,
})

const normalizeSavings = (data: any) => ({
  unlocked: Boolean(data?.unlocked ?? true),
  balance: String(data?.balance ?? data?.savings_balance ?? 0),
  total_interest_earned: String(data?.total_interest_earned ?? data?.interest_earned ?? 0),
  annual_interest_rate: toNumber(data?.annual_interest_rate ?? data?.interest_rate ?? 0),
  wallet_balance: String(data?.wallet_balance ?? data?.walletBalance ?? 0),
})

const normalizeInsurance = (data: any) => ({
  unlocked: Boolean(data?.unlocked ?? true),
  active: Boolean(data?.has_active_policy ?? data?.active ?? data?.is_active ?? false),
  premium_per_day: String(data?.active_policy?.premium_per_day ?? data?.premium_per_day ?? data?.premium ?? 0),
  coverage_limit: String(data?.active_policy?.coverage_limit ?? data?.coverage_limit ?? data?.coverage ?? 0),
  paused: Boolean(data?.paused ?? false),
})

const normalizeLoans = (data: any) => {
  const loans = unwrap(data, ['loans', 'results'])
  return Array.isArray(loans) ? loans : []
}

const normalizeClaims = (data: any) => {
  const claims = unwrap(data, ['claims', 'results'])
  return Array.isArray(claims) ? claims : []
}

export const getSavings = async () => {
  const response = await apiClient.get(ENDPOINTS.SAVINGS)
  return normalizeSavings(unwrap(response, ['savings', 'data']))
}

export const depositSavings = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.SAVINGS_DEPOSIT, { amount })
  return response
}

export const withdrawSavings = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.SAVINGS_WITHDRAW, { amount })
  return response
}

export const getLoans = async () => {
  const response = await apiClient.get(ENDPOINTS.LOANS)
  return normalizeLoans(unwrap(response, ['loans', 'data']))
}

export const checkLoanEligibility = async () => {
  const response = await apiClient.get(ENDPOINTS.LOAN_ELIGIBILITY)
  return normalizeLoanEligibility(unwrap(response, ['eligibility', 'data']))
}

export const applyLoan = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.LOAN_APPLY, { amount })
  return response
}

export const repayLoan = async (loan_id: string, amount: number) => {
  const response = await apiClient.post(ENDPOINTS.LOAN_REPAY, {
    loan_id,
    amount,
  })
  return response
}

export const getInsurance = async () => {
  const response = await apiClient.get(ENDPOINTS.INSURANCE)
  return normalizeInsurance(unwrap(response, ['insurance', 'data']))
}

export const activateInsurance = async () => {
  const response = await apiClient.post(ENDPOINTS.INSURANCE_ACTIVATE, {})
  return response
}

export const fileClaim = async (data: {
  days_missed: number
  reason: string
}) => {
  const response = await apiClient.post(ENDPOINTS.INSURANCE_CLAIM, data)
  return response
}

export const getClaims = async () => {
  const response = await apiClient.get(ENDPOINTS.INSURANCE_CLAIMS)
  return normalizeClaims(unwrap(response, ['claims', 'data']))
}
