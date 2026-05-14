import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

export const getSavings = async () => {
  const response = await apiClient.get(ENDPOINTS.SAVINGS)
  return response.data
}

export const depositSavings = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.SAVINGS_DEPOSIT, { amount })
  return response.data
}

export const withdrawSavings = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.SAVINGS_WITHDRAW, { amount })
  return response.data
}

export const getLoans = async () => {
  const response = await apiClient.get(ENDPOINTS.LOANS)
  return response.data
}

export const checkLoanEligibility = async () => {
  const response = await apiClient.get(ENDPOINTS.LOAN_ELIGIBILITY)
  return response.data
}

export const applyLoan = async (amount: number) => {
  const response = await apiClient.post(ENDPOINTS.LOAN_APPLY, { amount })
  return response.data
}

export const repayLoan = async (loan_id: string, amount: number) => {
  const response = await apiClient.post(ENDPOINTS.LOAN_REPAY, {
    loan_id,
    amount,
  })
  return response.data
}

export const getInsurance = async () => {
  const response = await apiClient.get(ENDPOINTS.INSURANCE)
  return response.data
}

export const activateInsurance = async () => {
  const response = await apiClient.post(ENDPOINTS.INSURANCE_ACTIVATE, {})
  return response.data
}

export const fileClaim = async (data: {
  days_missed: number
  reason: string
}) => {
  const response = await apiClient.post(ENDPOINTS.INSURANCE_CLAIM, data)
  return response.data
}

export const getClaims = async () => {
  const response = await apiClient.get(ENDPOINTS.INSURANCE_CLAIMS)
  return response.data
}
