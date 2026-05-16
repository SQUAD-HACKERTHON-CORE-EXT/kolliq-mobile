import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT, BUSINESS_RULES } from '../../constants';
import { useAppStore } from '../../store/useAppStore';
import { applyLoan, checkLoanEligibility, getLoans } from '../../services/financialService';
import { getErrorMessage } from '../../utils/handleApiError';

export default function LoansScreen({ navigation }: any) {
  const [loanRequested, setLoanRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [requestError, setRequestError] = useState('');

  const loansUnlocked = useAppStore((state) => state.loansUnlocked);
  const eisScore = useAppStore((state) => state.eisScore);
  const loanEligibility = useAppStore((state) => state.loanEligibility);
  const activeLoans = useAppStore((state) => state.activeLoans);

  const setLoanEligibility = useAppStore((state) => state.setLoanEligibility);
  const setActiveLoans = useAppStore((state) => state.setActiveLoans);

  useEffect(() => {
    loadLoanData();
  }, []);

  const loadLoanData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      const [eligData, loansData] = await Promise.all([
        checkLoanEligibility(),
        getLoans(),
      ]);

      if (eligData) {
        setLoanEligibility(eligData);
      }
      if (loansData) {
        setActiveLoans(loansData);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Failed to load loan data'));
      console.log('Loan data load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    try {
      setRequestError('');
      await applyLoan(loan?.max_amount || 0);
      setLoanRequested(true);
    } catch (error) {
      setRequestError(getErrorMessage(error, 'Failed to submit loan request'));
    }
  };

  const loan = loanEligibility;
  const isUnlocked = loansUnlocked;

  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Micro-Loans</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconBox}>
            <Ionicons name="lock-closed" size={48} color={COLORS.textMuted} />
          </View>
          <Text style={styles.lockedTitle}>Loans Not Yet Unlocked</Text>
            <Text style={styles.lockedSubtitle}>
            Complete more gigs and grow your EIS Score to unlock micro-loans.
          </Text>
          <View style={styles.lockedProgressCard}>
            <View style={styles.lockedProgressHeader}>
              <Text style={styles.lockedProgressLabel}>Your EIS Score</Text>
              <Text style={styles.lockedProgressValue}>{eisScore}/{BUSINESS_RULES.LOAN_UNLOCK_SCORE}</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${Math.min((eisScore / BUSINESS_RULES.LOAN_UNLOCK_SCORE) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.lockedProgressHint}>
              {Math.max(0, BUSINESS_RULES.LOAN_UNLOCK_SCORE - eisScore)} more points needed
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Keep Working</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Micro-Loans</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading loan details…</Text>
          </View>
        ) : loadError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{loadError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadLoanData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {/* Eligibility Card */}
        <View style={styles.eligibilityCard}>
          <View style={styles.eligibilityHeader}>
            <View style={styles.eligibilityIconBox}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <View>
              <Text style={styles.eligibilityTitle}>You're Eligible!</Text>
              <Text style={styles.eligibilitySubtitle}>{loan?.note || 'You are eligible to apply.'}</Text>
            </View>
          </View>
        </View>

        {/* Loan Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Loan Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="cash-outline" size={18} color={COLORS.primary} />
              <Text style={styles.detailLabel}>Maximum Amount</Text>
            </View>
            <Text style={styles.detailValue}>₦{loan?.max_amount?.toLocaleString() || '0'}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="trending-up" size={18} color={COLORS.accent} />
              <Text style={styles.detailLabel}>Interest Rate</Text>
            </View>
            <Text style={styles.detailValue}>{loan?.interest_rate || 0}%</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
              <Text style={styles.detailLabel}>Repayment Period</Text>
            </View>
            <Text style={styles.detailValue}>{loan?.tenure_days || 0} days</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calculator-outline" size={18} color="#A855F7" />
              <Text style={styles.detailLabel}>Total Repayment</Text>
            </View>
            <Text style={styles.detailValue}>₦{loan ? (loan.max_amount * (1 + loan.interest_rate / 100)).toLocaleString() : '0'}</Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>How It Works</Text>
          <StepItem number={1} text="Choose your loan amount (up to ₦10,000)" />
          <StepItem number={2} text="Funds are disbursed to your wallet instantly" />
          <StepItem number={3} text="Repayment is deducted from gig earnings over 28 days" />
        </View>

        {/* Apply Button */}
        {!loanRequested ? (
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyLoan}>
            <Text style={styles.applyButtonText}>Apply for Loan</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.requestedCard}>
            <Ionicons name="checkmark-circle" size={32} color={COLORS.primary} />
            <Text style={styles.requestedTitle}>Loan Request Submitted!</Text>
            <Text style={styles.requestedSubtitle}>Your loan will be reviewed and disbursed to your wallet shortly.</Text>
          </View>
        )}

        {requestError ? <Text style={styles.requestError}>{requestError}</Text> : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const StepItem = ({ number, text }: { number: number; text: string }) => (
  <View style={styles.stepRow}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
  },
  // Locked state
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  lockedIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 22,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  lockedSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  lockedProgressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  lockedProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lockedProgressLabel: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
  },
  lockedProgressValue: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  progressBg: {
    height: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  lockedProgressHint: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 14,
    padding: 14,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.18)',
  },
  errorText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: '#B91C1C',
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  requestError: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: '#B91C1C',
  },
  // Unlocked state
  eligibilityCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  eligibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eligibilityIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eligibilityTitle: {
    fontSize: 17,
    fontFamily: FONTS.weights.bold,
    color: '#10B981',
  },
  eligibilitySubtitle: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  howItWorksCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  requestedCard: {
    backgroundColor: COLORS.badgeGreen,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  requestedTitle: {
    fontSize: 17,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
    marginTop: 8,
  },
  requestedSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
});
