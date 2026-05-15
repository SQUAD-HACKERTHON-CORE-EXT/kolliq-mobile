import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { formatNumber } from '../../utils/formatCurrency';
import { getSavings, checkLoanEligibility, getInsurance } from '../../services/financialService';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline' as const, activeIcon: 'grid' as const },
  { id: 'TraderMarket', label: 'Market', icon: 'cart-outline' as const, activeIcon: 'cart' as const },
  { id: 'TraderIdentityTab', label: 'Identity', icon: 'finger-print-outline' as const, activeIcon: 'finger-print' as const },
  { id: 'TraderAccount', label: 'Account', icon: 'person-outline' as const, activeIcon: 'person' as const },
];

const getEisTier = (score: number) => {
  if (score >= 100) return 'Platinum';
  if (score >= 70) return 'Gold Tier';
  if (score >= 50) return 'Silver Tier';
  if (score >= 20) return 'Bronze Tier';
  return 'Starter Tier';
};

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  unlocked: boolean;
  unlockScore: number;
  currentScore: number;
  summary: string;
  onPress: () => void;
}

const FeatureCard = ({
  icon,
  title,
  unlocked,
  unlockScore,
  currentScore,
  summary,
  onPress,
}: FeatureCardProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={unlocked ? 0.8 : 1}>
    <Card variant="outline" style={[styles.featureCard, !unlocked && styles.featureCardLocked]}>
      <View style={styles.featureRow}>
        <View style={[styles.featureIconWrap, !unlocked && styles.featureIconLocked]}>
          <Ionicons name={icon} size={22} color={unlocked ? COLORS.primary : COLORS.textMuted} />
        </View>
        <View style={styles.featureBody}>
          <View style={styles.featureTitleRow}>
            <Text style={[styles.featureTitle, !unlocked && styles.featureTitleLocked]}>
              {title}
            </Text>
            {unlocked ? (
              <View style={styles.unlockedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.secondary} />
                <Text style={styles.unlockedText}>Unlocked</Text>
              </View>
            ) : (
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
                <Text style={styles.lockedText}>{unlockScore} EIS</Text>
              </View>
            )}
          </View>
          <Text style={styles.featureSummary}>{summary}</Text>
          {!unlocked && (
            <View style={styles.lockProgressWrap}>
              <View style={styles.lockProgressBg}>
                <View
                  style={[
                    styles.lockProgressFill,
                    { width: `${Math.min(100, (currentScore / unlockScore) * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.lockProgressLabel}>
                {currentScore}/{unlockScore} EIS
              </Text>
            </View>
          )}
        </View>
        {unlocked && (
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        )}
      </View>
    </Card>
  </TouchableOpacity>
);

export default function TraderIdentityScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user);
  const eisScore = useAppStore((s) => s.eisScore);
  const savingsUnlocked = useAppStore((s) => s.savingsUnlocked);
  const loansUnlocked = useAppStore((s) => s.loansUnlocked);
  const insuranceUnlocked = useAppStore((s) => s.insuranceUnlocked);
  const setUser = useAppStore((s) => s.setUser);

  const [savings, setSavings] = useState<any>(null);
  const [loanEligibility, setLoanEligibility] = useState<any>(null);
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [profileRes, savRes, loanRes, insRes] = await Promise.allSettled([
        apiClient.get(ENDPOINTS.PROFILE),
        savingsUnlocked ? getSavings() : Promise.resolve(null),
        checkLoanEligibility(),
        insuranceUnlocked ? getInsurance() : Promise.resolve(null),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        const p = profileRes.value as any;
        setUser({
          id: p.id ?? user?.id ?? '',
          phone: p.phone ?? user?.phone ?? '',
          full_name: p.full_name ?? user?.full_name ?? '',
          role: p.role ?? user?.role ?? 'worker',
          email: p.email,
          location_city: p.location_city,
          trade_category: p.trade_category,
          market_name: p.market_name,
          business_name: p.business_name,
          squad_account_number: p.squad_account_number,
          squad_bank_name: p.squad_bank_name,
        });
      }

      if (savRes.status === 'fulfilled') setSavings(savRes.value);
      if (loanRes.status === 'fulfilled' && loanRes.value) {
        setLoanEligibility(loanRes.value);
        if ((loanRes.value as any).score !== undefined) {
          useAppStore.getState().setEisScore((loanRes.value as any).score);
        }
      }
      if (insRes.status === 'fulfilled') setInsurance(insRes.value);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [savingsUnlocked, loansUnlocked, insuranceUnlocked]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const savingsSummary = savingsUnlocked && savings
    ? `Balance: ₦${formatNumber(parseFloat(savings.balance || '0'))}`
    : 'Save from your wallet earnings.';

  const loanSummary = loansUnlocked && loanEligibility
    ? `Max loan: ₦${formatNumber(loanEligibility.max_amount ?? 0)}`
    : 'Access micro-loans for your trade.';

  const insuranceSummary = insuranceUnlocked && insurance
    ? insurance.active ? 'Policy active — you are covered.' : 'Activate your trade protection.'
    : 'Protect your income against losses.';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Identity</Text>
        <TouchableOpacity
          style={styles.eisBtn}
          onPress={() => navigation.navigate('EISScoreScreen')}
        >
          <Text style={styles.eisBtnText}>EIS Details</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {/* EIS Score */}
            <ScoreCard
              score={eisScore}
              tier={getEisTier(eisScore)}
              ptsToNext={Math.max(0, 100 - eisScore)}
            />

            {/* What is EIS */}
            <Card variant="outline" style={styles.eisInfoCard}>
              <View style={styles.eisInfoRow}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.eisInfoText}>
                  Your Economic Identity Score (EIS) is based on your trade activity, payments,
                  and verifications. A higher score unlocks more financial services.
                </Text>
              </View>
            </Card>

            {/* Unlock Milestones */}
            <Text style={styles.sectionLabel}>Financial Services</Text>

            <FeatureCard
              icon="save-outline"
              title="Savings"
              unlocked={savingsUnlocked}
              unlockScore={20}
              currentScore={eisScore}
              summary={savingsSummary}
              onPress={() => savingsUnlocked && navigation.navigate('SavingsScreen')}
            />

            <FeatureCard
              icon="cash-outline"
              title="Micro Loans"
              unlocked={loansUnlocked}
              unlockScore={50}
              currentScore={eisScore}
              summary={loanSummary}
              onPress={() => loansUnlocked && navigation.navigate('LoansScreen')}
            />

            <FeatureCard
              icon="shield-checkmark-outline"
              title="Trade Insurance"
              unlocked={insuranceUnlocked}
              unlockScore={70}
              currentScore={eisScore}
              summary={insuranceSummary}
              onPress={() => insuranceUnlocked && navigation.navigate('InsuranceScreen')}
            />

            {/* Score Timeline */}
            <Text style={styles.sectionLabel}>Score Milestones</Text>
            <Card variant="outline" style={styles.milestonesCard}>
              {[
                { score: 20, label: 'Savings Access', icon: 'save-outline' as const },
                { score: 50, label: 'Loan Access', icon: 'cash-outline' as const },
                { score: 70, label: 'Insurance Access', icon: 'shield-outline' as const },
                { score: 100, label: 'Platinum Status', icon: 'star-outline' as const },
              ].map((milestone, idx) => {
                const achieved = eisScore >= milestone.score;
                return (
                  <View key={milestone.score} style={styles.milestoneRow}>
                    <View
                      style={[
                        styles.milestoneDot,
                        achieved && styles.milestoneDotActive,
                      ]}
                    >
                      <Ionicons
                        name={achieved ? 'checkmark' : milestone.icon}
                        size={12}
                        color={achieved ? COLORS.white : COLORS.textMuted}
                      />
                    </View>
                    <View style={styles.milestoneBody}>
                      <Text
                        style={[
                          styles.milestoneLabel,
                          achieved && styles.milestoneLabelActive,
                        ]}
                      >
                        {milestone.label}
                      </Text>
                      <Text style={styles.milestoneScore}>{milestone.score} EIS Points</Text>
                    </View>
                    {achieved && (
                      <View style={styles.achievedBadge}>
                        <Text style={styles.achievedText}>Done</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>
          </>
        )}
      </ScrollView>

      <BottomNav
        activeTab="TraderIdentityTab"
        onTabPress={(tab) => navigation.navigate(tab)}
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  headerTitle: { fontSize: 24, fontFamily: FONTS.weights.bold, color: COLORS.text },
  eisBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  eisBtnText: { fontSize: 14, fontFamily: FONTS.weights.semibold, color: COLORS.primary },
  scrollContent: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingBottom: 100 },
  loadingCenter: { paddingTop: 80, alignItems: 'center' },
  eisInfoCard: { padding: SPACING.lg, marginTop: SPACING.lg },
  eisInfoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  eisInfoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: SPACING['2xl'],
    marginBottom: SPACING.lg,
  },
  featureCard: { padding: SPACING.lg, marginBottom: SPACING.md },
  featureCardLocked: { opacity: 0.75 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconLocked: { backgroundColor: COLORS.surfaceAlt },
  featureBody: { flex: 1 },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  featureTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  featureTitleLocked: { color: COLORS.textSecondary },
  unlockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  unlockedText: { fontSize: 11, fontFamily: FONTS.weights.bold, color: COLORS.secondary },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  lockedText: { fontSize: 11, fontFamily: FONTS.weights.medium, color: COLORS.textMuted },
  featureSummary: { fontSize: 13, fontFamily: FONTS.family, color: COLORS.textMuted },
  lockProgressWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  lockProgressBg: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 2,
  },
  lockProgressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  lockProgressLabel: { fontSize: 11, fontFamily: FONTS.weights.medium, color: COLORS.textMuted },
  milestonesCard: { padding: SPACING.lg },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  milestoneDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  milestoneDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  milestoneBody: { flex: 1 },
  milestoneLabel: { fontSize: 14, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary },
  milestoneLabelActive: { color: COLORS.text, fontFamily: FONTS.weights.bold },
  milestoneScore: { fontSize: 12, fontFamily: FONTS.family, color: COLORS.textMuted, marginTop: 2 },
  achievedBadge: {
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  achievedText: { fontSize: 11, fontFamily: FONTS.weights.bold, color: COLORS.primaryDark },
});
