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
  try {
    console.log('📤 APPLY LOAN - attempting POST', { url: ENDPOINTS.LOAN_APPLY, amount })
    const response = await apiClient.post(ENDPOINTS.LOAN_APPLY, { amount })
    return response
  } catch (error: any) {
    const status = error?.response?.status
    console.log('❌ APPLY LOAN error', { status, url: error?.config?.url, data: error?.response?.data })

    // Some backends may reject POST at a trailing-slash URL or expect GET for specific roles.
    // Try fallback: attempt form-encoded POST, then POST without trailing slash, then GET as a last resort.
    try {
      console.log('📤 APPLY LOAN - retrying POST with form-encoded body')
      const params = new URLSearchParams()
      params.append('amount', String(amount))
      const respForm = await apiClient.post(ENDPOINTS.LOAN_APPLY, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return respForm
    } catch (errForm: any) {
      console.log('❌ APPLY LOAN form-encoded POST failed', { err: errForm?.response?.data ?? errForm?.message })
    }
    try {
      const altUrl = String(ENDPOINTS.LOAN_APPLY).replace(/\/$/, '')
      if (altUrl !== ENDPOINTS.LOAN_APPLY) {
        console.log('📤 APPLY LOAN - retrying POST without trailing slash', { altUrl })
        const resp2 = await apiClient.post(altUrl, { amount })
        return resp2
      }
    } catch (err2: any) {
      console.log('❌ APPLY LOAN retry (no-trailing-slash) failed', { err: err2?.response?.data ?? err2?.message })
    }

    try {
      console.log('📤 APPLY LOAN - retrying GET as fallback (no params)')
      const resp3 = await apiClient.get(ENDPOINTS.LOAN_APPLY)
      return resp3
    } catch (err3: any) {
      console.log('❌ APPLY LOAN fallback GET failed (no params)', { err: err3?.response?.data ?? err3?.message })
    }

    try {
      console.log('📤 APPLY LOAN - retrying GET with amount query param')
      const resp4 = await apiClient.get(ENDPOINTS.LOAN_APPLY, { params: { amount } })
      return resp4
    } catch (err4: any) {
      console.log('❌ APPLY LOAN fallback GET with params failed', { err: err4?.response?.data ?? err4?.message })
    }

    // Re-throw original error if all fallbacks fail
    throw error
  }
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
