import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

// Keep this false so the full NIP never gets logged in normal usage.
const TEMP_LOG_FULL_NIP = false

const maskNip = (nip?: string) => {
  if (!nip) return null
  return nip.replace(/.(?=.{2})/g, '*')
}

const normalizeNipCode = (nip?: string) => {
  const normalized = String(nip ?? '').replace(/\D/g, '').trim()
  return normalized.length ? normalized : ''
}

// Re-export so callers can normalise NIP before passing it to any API helper
export { normalizeNipCode }

// apiClient response interceptor returns: `response.data?.data ?? response.data`
// That is the single resolved data value — the wallet object itself.
// Every wallet-service function returns that resolved value with no further unwrapping.
export const getWallet = async (): Promise<any> => {
  const data: any = await apiClient.get(ENDPOINTS.WALLET)
  // Log ABSOLUTE final value — if account_number / balance appear here,
  // the Wallet._COLLECTED const below sees them correctly.
  console.log('💳 WALLET (resolved by apiClient):', JSON.stringify(data, null, 2));
  return data;               // single-pass resolve — NO SECOND .data
}

export const waitForWallet = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 12

    const poll = async () => {
      try {
        const data = await getWallet()  // flat wallet object
        console.log(`⏳ waitForWallet attempt ${attempts + 1}: wallet_ready=${data?.wallet_ready}, balance=${data?.balance}`);
        if (data?.wallet_ready) {
          resolve(data)
        }
        else if (attempts >= maxAttempts) {
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
  // apiClient returns one unwrap (response.data?.data ?? response.data)
  const response: any = await apiClient.get(ENDPOINTS.BANKS)
  console.log('🏦 BANKS (1st-unwrapped by apiClient):', JSON.stringify(response, null, 2));

  // Backend may return directly as [...], or as { banks: [...] } / { data: [...] }
  const list = response?.banks ?? response?.data ?? response;
  return Array.isArray(list) ? list : [];
}

export const getBankAccount = async () => {
  const data: any = await apiClient.get(ENDPOINTS.BANK_ACCOUNT)
  console.log('🏦 BANK ACCOUNT (1st-unwrapped by apiClient):', JSON.stringify(data, null, 2));
  return data;               // already fully unwrapped
}

export const verifyBankAccount = async (
  bank_code: string,
  account_number: string,
  nip_code?: string
) => {
  const preNormalized = String(nip_code ?? '')

  const normalizedNipCode = normalizeNipCode(nip_code)

  if (normalizedNipCode && normalizedNipCode.length !== 6) {
    throw new Error('NIP code must be 6 digits.')
  }

  const body: any = {
    bank_code: String(bank_code),
    account_number: String(account_number),
    ...(normalizedNipCode ? { nip_code: normalizedNipCode } : {}),
  }

  console.log('📤 VERIFY BANK – full body:', JSON.stringify(body))
  console.log('   nip raw→norm:', JSON.stringify(preNormalized), '→', JSON.stringify(normalizedNipCode),
              '| len:', normalizedNipCode.length,
              '| typeof:', typeof normalizedNipCode)

  const response = await apiClient.post(ENDPOINTS.VERIFY_BANK, body)
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

export const requestPayout = async (amount: number, note?: string) => {
  const response = await apiClient.post(ENDPOINTS.REQUEST_PAYOUT, {
    amount,
    note,
  })

  console.log('💸 REQUEST PAYOUT RESPONSE:', JSON.stringify(response, null, 2))

  return response as any
}

export const getTransactions = async () => {
  const data: any = await apiClient.get(ENDPOINTS.TRANSACTIONS)
  console.log('📋 TRANSACTIONS (1st-unwrapped by apiClient):', JSON.stringify(data, null, 2));

  // Backend may return { transactions: [...] } or [...] directly
  const txns = data?.transactions ?? data;
  return Array.isArray(txns) ? txns : [];
}
