import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants';
import { ApiResponse } from '../types';

interface ScoreFactors {
  transactionFrequency: number; // 0-20
  transactionConsistency: number; // 0-20
  gigCompletionRate: number; // 0-20
  savingsBehavior: number; // 0-10
  loanRepaymentHistory: number; // 0-15
  locationConsistency: number; // 0-10
  employerRatings: number; // 0-5
}

interface EconomicIdentityScore {
  score: number; // 0-100
  factors: ScoreFactors;
  lastUpdated: string;
  nextUpdate: string;
}

class AIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/ai`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Calculate Economic Identity Score
   */
  async calculateEIS(userId: string): Promise<EconomicIdentityScore> {
    try {
      const response = await this.api.post<
        ApiResponse<EconomicIdentityScore>
      >('/eis/calculate', { userId });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get EIS score details
   */
  async getEISDetails(userId: string): Promise<EconomicIdentityScore> {
    try {
      const response = await this.api.get<ApiResponse<EconomicIdentityScore>>(
        `/eis/${userId}`
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Predict next EIS milestone
   */
  async predictNextMilestone(userId: string): Promise<{
    nextScore: number;
    estimatedDays: number;
    requiredActions: string[];
  }> {
    try {
      const response = await this.api.get<
        ApiResponse<{
          nextScore: number;
          estimatedDays: number;
          requiredActions: string[];
        }>
      >(`/eis/${userId}/next-milestone`);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get job recommendations for user
   */
  async getJobRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<
    Array<{
      jobId: string;
      matchScore: number;
      matchReasons: string[];
    }>
  > {
    try {
      const response = await this.api.get<
        ApiResponse<
          Array<{
            jobId: string;
            matchScore: number;
            matchReasons: string[];
          }>
        >
      >(`/recommend/jobs/${userId}`, {
        params: { limit },
      });
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Detect fraud patterns in user activity
   */
  async detectFraud(userId: string): Promise<{
    isFraudulent: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    flags: string[];
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          isFraudulent: boolean;
          riskLevel: 'low' | 'medium' | 'high';
          flags: string[];
        }>
      >('/fraud/detect', { userId });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's financial profile summary
   */
  async getFinancialProfile(userId: string): Promise<{
    totalTransactions: number;
    averageMonthlyActivity: number;
    totalSaved: number;
    activeLoanCount: number;
    activeInsuranceCount: number;
    trustScore: number;
  }> {
    try {
      const response = await this.api.get<
        ApiResponse<{
          totalTransactions: number;
          averageMonthlyActivity: number;
          totalSaved: number;
          activeLoanCount: number;
          activeInsuranceCount: number;
          trustScore: number;
        }>
      >(`/profile/${userId}/financial`);
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get skill-based recommendations
   */
  async getSkillRecommendations(skills: string[]): Promise<{
    topSkills: string[];
    recommendedSkillsToAdd: string[];
    marketDemand: Record<string, number>;
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          topSkills: string[];
          recommendedSkillsToAdd: string[];
          marketDemand: Record<string, number>;
        }>
      >('/skills/analyze', { skills });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate loan eligibility
   */
  async calculateLoanEligibility(userId: string): Promise<{
    isEligible: boolean;
    maxAmount: number;
    interestRate: number;
    requiredScore: number;
    currentScore: number;
    daysUntilEligible?: number;
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          isEligible: boolean;
          maxAmount: number;
          interestRate: number;
          requiredScore: number;
          currentScore: number;
          daysUntilEligible?: number;
        }>
      >('/eligibility/loan', { userId });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate insurance eligibility
   */
  async calculateInsuranceEligibility(userId: string): Promise<{
    isEligible: boolean;
    availablePlans: Array<{
      type: 'trade' | 'health' | 'income';
      monthlyPremium: number;
      coverage: number;
    }>;
    requiredScore: number;
    currentScore: number;
    daysUntilEligible?: number;
  }> {
    try {
      const response = await this.api.post<
        ApiResponse<{
          isEligible: boolean;
          availablePlans: Array<{
            type: 'trade' | 'health' | 'income';
            monthlyPremium: number;
            coverage: number;
          }>;
          requiredScore: number;
          currentScore: number;
          daysUntilEligible?: number;
        }>
      >('/eligibility/insurance', { userId });
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Analyze transaction patterns
   */
  async analyzeTransactionPatterns(userId: string): Promise<{
    averageTransactionAmount: number;
    transactionFrequency: string; // e.g., "daily", "weekly", "monthly"
    peakHours: string[];
    consistencyScore: number; // 0-100
    trends: 'increasing' | 'stable' | 'decreasing';
  }> {
    try {
      const response = await this.api.get<
        ApiResponse<{
          averageTransactionAmount: number;
          transactionFrequency: string;
          peakHours: string[];
          consistencyScore: number;
          trends: 'increasing' | 'stable' | 'decreasing';
        }>
      >(`/analysis/transactions/${userId}`);
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
        'AI calculation failed. Please try again.';
      return new Error(message);
    }
    return error;
  }
}

export const aiService = new AIService();
