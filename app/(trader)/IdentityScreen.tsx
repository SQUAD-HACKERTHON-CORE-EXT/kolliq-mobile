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
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { WalletCard } from '../../components/ui/WalletCard';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { formatNumber } from '../../utils/formatCurrency';
import { getWallet, getTransactions } from '../../services/walletService';
import { checkLoanEligibility } from '../../services/financialService';
import { getCategories, getListings } from '../../services/marketplaceService';
import { getErrorMessage } from '../../utils/handleApiError';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

// ── Unique tab IDs fix (was all 'TraderHome' → duplicate key error) ──────────
const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline' as const, activeIcon: 'grid' as const },
  { id: 'TraderMarket', label: 'Market', icon: 'cart-outline' as const, activeIcon: 'cart' as const },
  { id: 'TraderIdentityTab', label: 'Identity', icon: 'finger-print-outline' as const, activeIcon: 'finger-print' as const },
  { id: 'TraderAccount', label: 'Account', icon: 'person-outline' as const, activeIcon: 'person' as const },
];

const EIS_LOAN_THRESHOLD = 50;

const getEisTier = (score: number) => {
  if (score >= 100) return 'Platinum';
  if (score >= 70) return 'Gold Tier';
  if (score >= 50) return 'Silver Tier';
  if (score >= 20) return 'Bronze Tier';
  return 'Starter Tier';
};

const formatRelativeDate = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
};

export default function TraderHomeScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user);
  const eisScore = useAppStore((s) => s.eisScore);
  const loansUnlocked = useAppStore((s) => s.loansUnlocked);
  const setUser = useAppStore((s) => s.setUser);
  const setWalletStore = useAppStore((s) => s.setWallet);
  const setTransactionsStore = useAppStore((s) => s.setTransactions);
  const wallet = useAppStore((s) => s.wallet);
  const transactions = useAppStore((s) => s.transactions);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loanEligibility, setLoanEligibility] = useState<any>(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [profileRes, walletRes, txnRes, loanRes, catRes, listRes] =
        await Promise.allSettled([
          apiClient.get(ENDPOINTS.PROFILE),
          getWallet(),
          getTransactions(),
          checkLoanEligibility(),
          getCategories(),
          getListings({ page: 1 }),
        ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        const profile = profileRes.value as any;
        setUser({
          id: profile.id ?? user?.id ?? '',
          phone: profile.phone ?? user?.phone ?? '',
          full_name: profile.full_name ?? user?.full_name ?? '',
          role: profile.role ?? user?.role ?? 'worker',
          email: profile.email,
          location_city: profile.location_city,
          trade_category: profile.trade_category,
          market_name: profile.market_name,
          business_name: profile.business_name,
          squad_account_number: profile.squad_account_number,
          squad_bank_name: profile.squad_bank_name,
          eis_score: profile.eis_score ?? 0,
        });
      }

      if (walletRes.status === 'fulfilled' && walletRes.value) {
        setWalletStore(walletRes.value as any);
      }

      if (txnRes.status === 'fulfilled' && txnRes.value) {
        const txnData = txnRes.value as any;
        const txns = txnData?.transactions ?? (Array.isArray(txnData) ? txnData : []);
        setTransactionsStore(Array.isArray(txns) ? txns : []);
      }

      if (loanRes.status === 'fulfilled') {
        setLoanEligibility(loanRes.value);
      }

      if (catRes.status === 'fulfilled') {
        setCategories((catRes.value as any[]) ?? []);
      }

      if (listRes.status === 'fulfilled') {
        setListings((listRes.value as any[]) ?? []);
      }
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load dashboard data'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const displayName = user?.business_name || user?.full_name || 'Trader';
  const balanceAmount = wallet ? parseFloat(wallet.balance || '0') : 0;
  const recentTxns = transactions.slice(0, 3);
  const loanProgress = Math.min(100, (eisScore / EIS_LOAN_THRESHOLD) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader
        userName={displayName}
        greeting="Welcome back,"
        onNotificationPress={() => {}}
        onProfilePress={() => navigation.navigate('TraderAccount')}
      />

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
            <Text style={styles.loadingText}>Loading your dashboard…</Text>
          </View>
        ) : (
          <>
            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color="#B91C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <WalletCard
              title="Available Balance"
              balance={formatNumber(balanceAmount)}
              score={eisScore}
              primaryActionTitle="Add Money"
              secondaryActionTitle="Transfer"
              onPrimaryAction={() => navigation.navigate('WalletScreen')}
              onSecondaryAction={() => navigation.navigate('WalletScreen')}
            />

            {/* Quick Actions */}
            <View style={styles.quickActionRow}>
              {[
                { label: 'Wallet', icon: 'wallet-outline' as const, route: 'WalletScreen' },
                { label: 'Savings', icon: 'save-outline' as const, route: 'SavingsScreen' },
                { label: 'Loans', icon: 'cash-outline' as const, route: 'LoansScreen' },
                { label: 'Insurance', icon: 'shield-outline' as const, route: 'InsuranceScreen' },
              ].map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.actionBtnContainer}
                  onPress={() => navigation.navigate(action.route)}
                >
                  <View style={styles.actionBtn}>
                    <Ionicons name={action.icon} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionBtnLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* EIS Score */}
            <View style={styles.section}>
              <ScoreCard
                score={eisScore}
                tier={getEisTier(eisScore)}
                ptsToNext={Math.max(0, 100 - eisScore)}
              />
            </View>

            {/* Loan Unlock Card */}
            <TouchableOpacity
              style={styles.loanCard}
              onPress={() => navigation.navigate('LoansScreen')}
              activeOpacity={0.85}
            >
              {loansUnlocked ? (
                <>
                  <Text style={styles.loanLabel}>Working Capital Loans Unlocked 🎉</Text>
                  <Text style={styles.loanRequirement}>
                    Max eligible: ₦{formatNumber(loanEligibility?.max_amount ?? 0)}
                    {loanEligibility?.note ? `  •  ${loanEligibility.note}` : ''}
                  </Text>
                  <View style={styles.loanProgressBg}>
                    <View style={[styles.loanProgressFill, { width: '100%' }]} />
                  </View>
                  <Text style={[styles.loanAmountText, { color: COLORS.secondary, marginTop: 6 }]}>
                    Tap to apply →
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.loanLabel}>Unlock Working Capital Loans</Text>
                  <Text style={styles.loanRequirement}>
                    Reach EIS Score of {EIS_LOAN_THRESHOLD} to qualify.
                    {eisScore < EIS_LOAN_THRESHOLD
                      ? ` You need ${EIS_LOAN_THRESHOLD - eisScore} more points.`
                      : ''}
                  </Text>
                  <View style={styles.loanProgressRow}>
                    <View style={styles.loanProgressBg}>
                      <View style={[styles.loanProgressFill, { width: `${loanProgress}%` }]} />
                    </View>
                  </View>
                  <View style={styles.loanAmounts}>
                    <Text style={styles.loanAmountText}>{eisScore} EIS</Text>
                    <Text style={styles.loanAmountText}>{EIS_LOAN_THRESHOLD} EIS needed</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Marketplace Preview */}
            <View style={styles.section}>
              <SectionHeader
                title="Marketplace"
                onViewAll={() => navigation.navigate('TraderMarket')}
              />
              {categories.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryRow}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryChip}
                      onPress={() => navigation.navigate('TraderMarket')}
                    >
                      <Text style={styles.categoryChipText}>
                        {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {listings.slice(0, 3).map((listing) => (
                <Card key={listing.id} variant="outline" style={styles.listingCard}>
                  <Text style={styles.listingTitle}>{listing.title}</Text>
                  <Text style={styles.listingMeta}>
                    {listing.location_city || 'Marketplace'} • ₦{formatNumber(listing.price)}
                  </Text>
                  <Text style={styles.listingDesc} numberOfLines={2}>
                    {listing.description}
                  </Text>
                </Card>
              ))}

              {listings.length === 0 && !loading && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No active listings yet.</Text>
                </View>
              )}
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <SectionHeader
                title="Recent Activity"
                onViewAll={() => navigation.navigate('WalletScreen')}
              />
              {recentTxns.length > 0 ? (
                recentTxns.map((txn: any) => (
                  <ActivityItem
                    key={txn.id}
                    title={
                      txn.description ||
                      (txn.transaction_type === 'credit' ? 'Payment Received' : 'Payment Sent')
                    }
                    desc={txn.status === 'success' ? 'Completed' : (txn.status || '')}
                    amount={`${txn.transaction_type === 'credit' ? '+' : '-'} ₦${formatNumber(
                      parseFloat(txn.amount || '0')
                    )}`}
                    date={formatRelativeDate(txn.created_at)}
                    isCredit={txn.transaction_type === 'credit'}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No recent transactions.</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav
        activeTab="TraderHome"
        onTabPress={(tab) => navigation.navigate(tab)}
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ActivityItem = ({ title, desc, amount, date, isCredit }: any) => (
  <TouchableOpacity style={styles.activityRow}>
    <View style={styles.activityIcon}>
      <Ionicons
        name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
        size={20}
        color={isCredit ? COLORS.secondary : '#EF4444'}
      />
    </View>
    <View style={styles.activityInfo}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDate}>
        {date}
        {desc ? ` • ${desc}` : ''}
      </Text>
    </View>
    <Text
      style={[styles.activityAmount, { color: isCredit ? COLORS.secondary : '#EF4444' }]}
    >
      {amount}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingBottom: 100 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    padding: 12,
    marginBottom: SPACING.md,
  },
  errorText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: '#B91C1C', flex: 1 },
  section: { marginTop: SPACING.xl },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  actionBtnContainer: { alignItems: 'center' },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.badgeGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnLabel: { fontSize: 11, fontFamily: FONTS.weights.medium, color: COLORS.text },
  loanCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xl,
  },
  loanLabel: {
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: FONTS.weights.bold,
    marginBottom: 4,
  },
  loanRequirement: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONTS.weights.regular,
    marginBottom: 16,
    lineHeight: 18,
  },
  loanProgressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  loanProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 3,
  },
  loanProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  loanAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
  loanAmountText: { fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.weights.medium },
  categoryRow: { gap: 8, paddingBottom: 12 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipText: { fontSize: 12, fontFamily: FONTS.weights.medium, color: COLORS.text },
  listingCard: { marginBottom: 10, padding: SPACING.lg },
  listingTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  listingMeta: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  listingDesc: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.textMuted },
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  activityDate: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activityAmount: { fontSize: 15, fontFamily: FONTS.weights.bold },
});
