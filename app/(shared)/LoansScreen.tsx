import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DUMMY_LOAN_ELIGIBILITY, DUMMY_USER } from '../../constants/dummyData';

export default function LoansScreen({ navigation }: any) {
  const [loanRequested, setLoanRequested] = useState(false);
  const loan = DUMMY_LOAN_ELIGIBILITY;
  const user = DUMMY_USER;
  const isUnlocked = user.eis_score >= 60;

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
            Complete more gigs and grow your EIS Score to at least 60 points to unlock micro-loans.
          </Text>
          <View style={styles.lockedProgressCard}>
            <View style={styles.lockedProgressHeader}>
              <Text style={styles.lockedProgressLabel}>Your EIS Score</Text>
              <Text style={styles.lockedProgressValue}>{user.eis_score}/60</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${(user.eis_score / 60) * 100}%` }]} />
            </View>
            <Text style={styles.lockedProgressHint}>
              {60 - user.eis_score} more points needed
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
        {/* Eligibility Card */}
        <View style={styles.eligibilityCard}>
          <View style={styles.eligibilityHeader}>
            <View style={styles.eligibilityIconBox}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <View>
              <Text style={styles.eligibilityTitle}>You're Eligible!</Text>
              <Text style={styles.eligibilitySubtitle}>{loan.note}</Text>
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
            <Text style={styles.detailValue}>₦{loan.max_amount.toLocaleString()}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="trending-up" size={18} color={COLORS.accent} />
              <Text style={styles.detailLabel}>Interest Rate</Text>
            </View>
            <Text style={styles.detailValue}>{loan.interest_rate}%</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
              <Text style={styles.detailLabel}>Repayment Period</Text>
            </View>
            <Text style={styles.detailValue}>{loan.tenure_days} days</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calculator-outline" size={18} color="#A855F7" />
              <Text style={styles.detailLabel}>Total Repayment</Text>
            </View>
            <Text style={styles.detailValue}>₦{(loan.max_amount * (1 + loan.interest_rate / 100)).toLocaleString()}</Text>
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
          <TouchableOpacity style={styles.applyButton} onPress={() => setLoanRequested(true)}>
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
