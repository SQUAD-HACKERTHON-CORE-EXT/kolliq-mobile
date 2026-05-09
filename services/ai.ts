import api from './api';
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
  /**
   * Calculate Economic Identity Score
   */
  async calculateEIS(userId: string): Promise<EconomicIdentityScore> {
    const response = await api.post<ApiResponse<EconomicIdentityScore>>(
      '/ai/eis/calculate',
      { userId }
    );
    return response.data.data!;
  }

  /**
   * Get EIS score details
   */
  async getEISDetails(userId: string): Promise<EconomicIdentityScore> {
    const response = await api.get<ApiResponse<EconomicIdentityScore>>(
      `/ai/eis/${userId}`
    );
    return response.data.data!;
  }

  /**
   * Predict next EIS milestone
   */
  async predictNextMilestone(userId: string): Promise<{
    nextScore: number;
    estimatedDays: number;
    requiredActions: string[];
  }> {
    const response = await api.get<
      ApiResponse<{
        nextScore: number;
        estimatedDays: number;
        requiredActions: string[];
      }>
    >(`/ai/eis/${userId}/next-milestone`);
    return response.data.data!;
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
    const response = await api.get<
      ApiResponse<
        Array<{
          jobId: string;
          matchScore: number;
          matchReasons: string[];
        }>
      >
    >(`/ai/recommend/jobs/${userId}`, {
      params: { limit },
    });
    return response.data.data || [];
  }

  /**
   * Detect fraud patterns in user activity
   */
  async detectFraud(userId: string): Promise<{
    isFraudulent: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    flags: string[];
  }> {
    const response = await api.post<
      ApiResponse<{
        isFraudulent: boolean;
        riskLevel: 'low' | 'medium' | 'high';
        flags: string[];
      }>
    >('/ai/fraud/detect', { userId });
    return response.data.data!;
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
    const response = await api.get<
      ApiResponse<{
        totalTransactions: number;
        averageMonthlyActivity: number;
        totalSaved: number;
        activeLoanCount: number;
        activeInsuranceCount: number;
        trustScore: number;
      }>
    >(`/ai/profile/${userId}/financial`);
    return response.data.data!;
  }

  /**
   * Get skill-based recommendations
   */
  async getSkillRecommendations(skills: string[]): Promise<{
    topSkills: string[];
    recommendedSkillsToAdd: string[];
    marketDemand: Record<string, number>;
  }> {
    const response = await api.post<
      ApiResponse<{
        topSkills: string[];
        recommendedSkillsToAdd: string[];
        marketDemand: Record<string, number>;
      }>
    >('/ai/skills/analyze', { skills });
    return response.data.data!;
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
    const response = await api.post<
      ApiResponse<{
        isEligible: boolean;
        maxAmount: number;
        interestRate: number;
        requiredScore: number;
        currentScore: number;
        daysUntilEligible?: number;
      }>
    >('/ai/eligibility/loan', { userId });
    return response.data.data!;
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
    const response = await api.post<
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
    >('/ai/eligibility/insurance', { userId });
    return response.data.data!;
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
    const response = await api.get<
      ApiResponse<{
        averageTransactionAmount: number;
        transactionFrequency: string;
        peakHours: string[];
        consistencyScore: number;
        trends: 'increasing' | 'stable' | 'decreasing';
      }>
    >(`/ai/analysis/transactions/${userId}`);
    return response.data.data!;
  }
}

export const aiService = new AIService();
