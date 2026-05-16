import api from './api';
import { ApiResponse, Wallet, Transaction } from '../types';
import { BASE_URL } from '../constants/api';

class SquadService {

  /**
   * Create virtual account for user
   */
  async createVirtualAccount(userId: string): Promise<Wallet> {
    const response = await api.post<ApiResponse<Wallet>>(
      '/squad/virtual-account/create',
      { userId }
    );
    return response.data.data!;
  }

  /**
   * Get wallet balance
   */
  async getWallet(accountNumber: string): Promise<Wallet> {
    const response = await api.get<ApiResponse<Wallet>>(
      `/squad/wallet/${accountNumber}`
    );
    return response.data.data!;
  }

  /**
   * Get transaction history
   */
  async getTransactions(
    accountNumber: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>(
      `/squad/wallet/${accountNumber}/transactions`,
      {
        params: { limit, offset },
      }
    );
    return response.data.data || [];
  }

  /**
   * Create escrow for gig payment
   */
  async createEscrow(data: {
    employerId: string;
    jobSeekerId: string;
    jobId: string;
    amount: number;
    description: string;
  }): Promise<{ escrowId: string; status: string }> {
    // Django-only escrow initiation candidates (DRF commonly requires trailing slash).
    const endpointCandidates = [
      `${BASE_URL}/api/virtual-account/initiate-dynamic-virtual-account/`,
      `${BASE_URL}/api/virtual-account/initiate-dynamic-virtual-account`,
      `${BASE_URL}/virtual-account/initiate-dynamic-virtual-account/`,
      `${BASE_URL}/virtual-account/initiate-dynamic-virtual-account`,
      `${BASE_URL}/api/squad/virtual-account/initiate-dynamic-virtual-account/`,
      `${BASE_URL}/api/squad/virtual-account/initiate-dynamic-virtual-account`,
      `${BASE_URL}/api/payments/escrow/create/`,
      `${BASE_URL}/api/payments/escrow/create`,
    ]

    let lastErr: any = null
    for (const url of endpointCandidates) {
      try {
        console.log('squad.createEscrow: trying', url)
        const response = await api.post<
          ApiResponse<{ escrowId: string; status: string }>
        >(url, data)
        console.log('squad.createEscrow: success', url)
        return response.data.data!
      } catch (err: any) {
        lastErr = err
        console.warn('squad.createEscrow: attempt failed', url, err?.response?.status)
        const status = err?.response?.status
        // For auth/validation/server errors, stop and surface immediately.
        if (status && status !== 404) {
          throw err
        }
      }
    }

    throw lastErr || new Error('Escrow endpoint not available')
  }

  /**
   * Release escrow payment
   */
  async releaseEscrow(escrowId: string): Promise<{ status: string }> {
    const response = await api.post<ApiResponse<{ status: string }>>(
      `/squad/escrow/${escrowId}/release`
    );
    return response.data.data!;
  }

  /**
   * Send payment to account
   */
  async sendPayment(data: {
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    reference: string;
  }): Promise<{ transactionId: string; status: string }> {
    const response = await api.post<
      ApiResponse<{ transactionId: string; status: string }>
    >('/squad/payment/send', data);
    return response.data.data!;
  }

  /**
   * Request loan disbursement
   */
  async disburseLoan(data: {
    userId: string;
    amount: number;
    loanId: string;
  }): Promise<{ transactionId: string; status: string }> {
    const response = await api.post<
      ApiResponse<{ transactionId: string; status: string }>
    >('/squad/loan/disburse', data);
    return response.data.data!;
  }

  /**
   * Setup automatic deduction for loan repayment
   */
  async setupAutoDeduction(data: {
    accountNumber: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    reason: 'loan_repayment' | 'insurance_premium' | 'savings';
    reference: string;
  }): Promise<{ deductionId: string; status: string }> {
    const response = await api.post<
      ApiResponse<{ deductionId: string; status: string }>
    >('/squad/auto-deduction/setup', data);
    return response.data.data!;
  }

  /**
   * Verify account details
   */
  async verifyAccount(accountNumber: string): Promise<{
    accountName: string;
    bankName: string;
    isValid: boolean;
  }> {
    const response = await api.post<
      ApiResponse<{
        accountName: string;
        bankName: string;
        isValid: boolean;
      }>
    >('/squad/account/verify', { accountNumber });
    return response.data.data!;
  }

  /**
   * Get wallet QR code for receiving payments
   */
  async getWalletQR(accountNumber: string): Promise<{ qrCode: string }> {
    const response = await api.get<ApiResponse<{ qrCode: string }>>(
      `/squad/wallet/${accountNumber}/qr`
    );
    return response.data.data!;
  }
}

export const squadService = new SquadService();
