import { BUSINESS_RULES } from '../constants';

/**
 * Calculate Economic Identity Score based on various factors
 */
export const calculateEISScore = (factors: {
  transactionCount: number;
  transactionConsistency: number; // 0-1
  completedJobs: number;
  jobCompletionRate: number; // 0-1
  totalSaved: number;
  loanRepaymentRate: number; // 0-1
  daysOnPlatform: number;
  averageRating: number; // 1-5
  locationConsistency: number; // 0-1
}): number => {
  let score = BUSINESS_RULES.INITIAL_EIS_SCORE; // Start at 10

  // Transaction frequency (0-20 points)
  const txFrequencyScore = Math.min(20, Math.floor(factors.transactionCount / 5));
  score += txFrequencyScore;

  // Transaction consistency (0-20 points)
  const txConsistencyScore = Math.round(factors.transactionConsistency * 20);
  score += txConsistencyScore;

  // Job completion rate (0-20 points)
  const completionRateScore =
    factors.completedJobs > 0 ? Math.round(factors.jobCompletionRate * 20) : 0;
  score += completionRateScore;

  // Savings behavior (0-10 points)
  const savingsScore = factors.totalSaved > 0 ? 10 : 0;
  score += savingsScore;

  // Loan repayment history (0-15 points)
  const loanRepaymentScore = Math.round(factors.loanRepaymentRate * 15);
  score += loanRepaymentScore;

  // Location consistency (0-10 points)
  const locationScore = Math.round(factors.locationConsistency * 10);
  score += locationScore;

  // Rating/reviews (0-5 points)
  const ratingScore = factors.completedJobs > 0 ? Math.round((factors.averageRating / 5) * 5) : 0;
  score += ratingScore;

  // Bonus for time on platform (progressive)
  if (factors.daysOnPlatform >= 30) score += 5;
  if (factors.daysOnPlatform >= 60) score += 5;
  if (factors.daysOnPlatform >= 90) score += 5;

  // Cap at 100
  return Math.min(score, BUSINESS_RULES.MAX_EIS_SCORE);
};

/**
 * Determine which financial services are unlocked based on score and days
 */
export const getUnlockedServices = (
  score: number,
  daysOnPlatform: number
): {
  savingsUnlocked: boolean;
  loanUnlocked: boolean;
  insuranceUnlocked: boolean;
} => {
  return {
    savingsUnlocked: daysOnPlatform >= BUSINESS_RULES.SAVINGS_UNLOCK_DAYS,
    loanUnlocked:
      score >= 30 && daysOnPlatform >= BUSINESS_RULES.LOAN_UNLOCK_DAYS,
    insuranceUnlocked:
      score >= 50 && daysOnPlatform >= BUSINESS_RULES.INSURANCE_UNLOCK_DAYS,
  };
};

/**
 * Get max loan amount based on EIS score
 */
export const getMaxLoanAmount = (score: number): number => {
  if (score < 30) return 0;
  if (score < 50) return 10000; // ₦10,000
  if (score < 70) return 25000; // ₦25,000
  if (score < 85) return 50000; // ₦50,000
  return 100000; // ₦100,000
};

/**
 * Get loan interest rate based on score
 */
export const getLoanInterestRate = (score: number): number => {
  if (score < 30) return 0; // Not eligible
  if (score < 50) return 10; // 10% monthly
  if (score < 70) return 8; // 8% monthly
  if (score < 85) return 6; // 6% monthly
  return 5; // 5% monthly
};

/**
 * Get insurance premium options based on score
 */
export const getInsurancePremiumOptions = (score: number): Array<{
  type: 'trade' | 'health' | 'income';
  dailyPremium: number;
  coverage: number;
}> => {
  if (score < 50) return [];

  const baseOptions = [
    { type: 'trade' as const, dailyPremium: 100, coverage: 20000 },
    { type: 'health' as const, dailyPremium: 150, coverage: 50000 },
    { type: 'income' as const, dailyPremium: 120, coverage: 30000 },
  ];

  // Higher score = better coverage/lower premium
  if (score >= 85) {
    return baseOptions.map((opt) => ({
      ...opt,
      dailyPremium: Math.round(opt.dailyPremium * 0.8),
      coverage: opt.coverage * 1.5,
    }));
  }
  if (score >= 70) {
    return baseOptions.map((opt) => ({
      ...opt,
      dailyPremium: Math.round(opt.dailyPremium * 0.9),
      coverage: opt.coverage * 1.25,
    }));
  }

  return baseOptions;
};

/**
 * Get score badge/tier
 */
export const getScoreTier = (
  score: number
): {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  label: string;
  color: string;
} => {
  if (score >= 85) {
    return {
      tier: 'platinum',
      label: 'Platinum',
      color: '#8B7FBF',
    };
  }
  if (score >= 70) {
    return {
      tier: 'gold',
      label: 'Gold',
      color: '#FFD700',
    };
  }
  if (score >= 50) {
    return {
      tier: 'silver',
      label: 'Silver',
      color: '#C0C0C0',
    };
  }
  return {
    tier: 'bronze',
    label: 'Bronze',
    color: '#CD7F32',
  };
};

/**
 * Calculate what actions will increase the score most
 */
export const getScoreBoostingActions = (score: number): string[] => {
  const actions: string[] = [];

  if (score < 30) {
    actions.push('Complete more gigs to increase completion rate');
    actions.push('Make regular transactions through your wallet');
  }

  if (score < 50) {
    actions.push('Maintain consistent daily activity');
    actions.push('Save regularly to unlock more services');
    actions.push('Get positive ratings from employers');
  }

  if (score < 70) {
    actions.push('Take on higher-value jobs');
    actions.push('Maintain location consistency');
    actions.push('Build strong repayment history with loans');
  }

  if (score < 85) {
    actions.push('Achieve perfect repayment record');
    actions.push('Increase transaction volume');
    actions.push('Maintain 5-star ratings');
  }

  return actions;
};
