import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

export const getWallet = async () => {
  const response: any = await apiClient.get(ENDPOINTS.WALLET)
  console.log('💳 WALLET DATA:', JSON.stringify(response?.data || response, null, 2));
  return response?.data || response;
}

export const waitForWallet = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 12

    const poll = async () => {
      try {
        const data = await getWallet()
        if (data.wallet_ready) {
          resolve(data)
        } else if (attempts >= maxAttempts) {
          reject(new Error('Wallet setup is taking longer than expected. Please try again.'))
        } else {
          attempts++
          setTimeout(poll, 2500)
        }
      } catch (error: any) {
        if (error.response?.status === 404 && attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 2500)
        } else {
          reject(error)
        }
      }
    }

    poll()
  })
}

export const getBanks = async () => {
  const response = await apiClient.get(ENDPOINTS.BANKS)
  return response as any
}

export const getBankAccount = async () => {
  const response = await apiClient.get(ENDPOINTS.BANK_ACCOUNT)
  return response as any
}

export const verifyBankAccount = async (
  bank_code: string,
  account_number: string
) => {
  const response = await apiClient.post(ENDPOINTS.VERIFY_BANK, {
    bank_code,
    account_number,
  })
  return response as any
}

export const saveBankAccount = async (data: {
  bank_code: string
  account_number: string
  bank_account_name: string
}) => {
  const response = await apiClient.post(ENDPOINTS.SAVE_BANK, {
    ...data,
    confirm: true,
  })
  return response as any
}

export const getTransactions = async () => {
  const response = await apiClient.get(ENDPOINTS.TRANSACTIONS)
  return response as any
}
