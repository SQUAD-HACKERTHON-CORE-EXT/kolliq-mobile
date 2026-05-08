import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants';
import { ApiResponse, Wallet, Transaction } from '../types';

class SquadService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/squad`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create virtual account for user
   */
  async createVirtualAccount(userId: string): Promise<Wallet> {
    try {
      const response = await this.api.post<ApiResponse<Wallet>>(
        '/virtual-account/create',
        { userId }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get wallet balance
   */
  async getWallet(accountNumber: string): Promise<Wallet> {
    try {
      const response = await this.api.get<ApiResponse<Wallet>>(
        `/wallet/${accountNumber}`
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(
    accountNumber: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Transaction[]> {
    try {
      const response = await this.api.get<ApiResponse<Transaction[]>>(
        `/wallet/${accountNumber}/transactions`,
        {
          params: { limit, offset },
        }
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<
        ApiResponse<{ escrowId: string; status: string }>
      >('/escrow/create', data);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Release escrow payment
   */
  async releaseEscrow(escrowId: string): Promise<{ status: string }> {
    try {
      const response = await this.api.post<ApiResponse<{ status: string }>>(
        `/escrow/${escrowId}/release`
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<
        ApiResponse<{ transactionId: string; status: string }>
      >('/payment/send', data);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Request loan disbursement
   */
  async disburseLoan(data: {
    userId: string;
    amount: number;
    loanId: string;
  }): Promise<{ transactionId: string; status: string }> {
    try {
      const response = await this.api.post<
        ApiResponse<{ transactionId: string; status: string }>
      >('/loan/disburse', data);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
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
    try {
      const response = await this.api.post<
        ApiResponse<{ deductionId: string; status: string }>
      >('/auto-deduction/setup', data);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify account details
   */
  async verifyAccount(accountNumber: string): Promise<{
    accountName: string;
    bankName: string;
    isValid: boolean;
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          accountName: string;
          bankName: string;
          isValid: boolean;
        }>
      >('/account/verify', { accountNumber });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get wallet QR code for receiving payments
   */
  async getWalletQR(accountNumber: string): Promise<{ qrCode: string }> {
    try {
      const response = await this.api.get<ApiResponse<{ qrCode: string }>>(
        `/wallet/${accountNumber}/qr`
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Payment operation failed. Please try again.';
      return new Error(message);
    }
    return error;
  }
}

export const squadService = new SquadService();
