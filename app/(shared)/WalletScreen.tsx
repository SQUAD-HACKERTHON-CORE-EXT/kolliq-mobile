import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Clipboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { getWallet, getTransactions } from '../../services/walletService';
import { getErrorMessage } from '../../utils/handleApiError';

const WALLET_TABS = ['Overview', 'Transactions', 'Savings'];

export default function WalletScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const wallet = useAppStore((state) => state.wallet);
  const transactions = useAppStore((state) => state.transactions);
  const walletLoading = useAppStore((state) => state.walletLoading);
  const transactionsLoading = useAppStore((state) => state.transactionsLoading);
  
  const setWallet = useAppStore((state) => state.setWallet);
  const setWalletLoading = useAppStore((state) => state.setWalletLoading);
  const setTransactions = useAppStore((state) => state.setTransactions);
  const setTransactionsLoading = useAppStore((state) => state.setTransactionsLoading);

  const user = useAppStore((state) => state.user);
  const userName = user?.full_name || 'Wallet';

  const isLoading = walletLoading || transactionsLoading;
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadWalletData();
  }, [retryKey]);

  const loadWalletData = async () => {
    try {
      setLoadError(null);
      setWalletLoading(true);
      setTransactionsLoading(true);

      const [walletData, txData] = await Promise.all([
        getWallet() as any,
        getTransactions() as any,
      ]);

      if (walletData) {
        setWallet(walletData);
      }
      if (txData) {
        setTransactions(txData.transactions || txData || []);
      }
    } catch (error: any) {
      setLoadError(getErrorMessage(error, 'Failed to load wallet data'));
      console.log('Wallet load error:', error);
    } finally {
      setWalletLoading(false);
      setTransactionsLoading(false);
    }
  };

  const getNavTabs = () => {
    if (user?.role === 'employer') {
      return [
        { id: 'EmployerDashboard', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
        { id: 'Workers', label: 'Workers', icon: 'people-outline' },
        { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline' },
        { id: 'EmployerProfile', label: 'Profile', icon: 'person-outline' },
      ];
    } else if (user?.role === 'trader') {
      return [
        { id: 'TraderHome', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { id: 'TraderHome', label: 'Market', icon: 'storefront-outline' },
        { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline' },
        { id: 'TraderHome', label: 'Account', icon: 'person-outline' },
      ];
    }
    return [
      { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
      { id: 'JobsFeed', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase' },
      { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
      { id: 'JobseekerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
    ];
  };

  const handleCopy = () => {
    if (wallet?.account_number) {
      Clipboard.setString(wallet.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  };

  const displayWallet = wallet;
  const displayTransactions = transactions;
  const displaySavings = {
    balance: wallet?.savings_balance || '0',
    total_interest_earned: '0',
    annual_interest_rate: 0,
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('ChangePin')}>
          <Ionicons name="settings-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {isLoading && !wallet ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1B4D3E" />
        </View>
      ) : loadError && !wallet ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setRetryKey(k => k + 1)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.currency}>₦</Text>
              <Text style={styles.balanceAmount}>
                {balanceVisible ? parseFloat(displayWallet?.balance || '0').toLocaleString('en-NG') : '••••••'}
              </Text>
              <Text style={styles.decimal}>{balanceVisible ? '.00' : ''}</Text>
            </View>

            {/* Account Info */}
            <TouchableOpacity style={styles.accountInfoRow} onPress={handleCopy}>
              <View style={styles.accountInfoLeft}>
                <Ionicons name="card-outline" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.accountNumber}>{displayWallet?.account_number || '—'}</Text>
                <Text style={styles.bankName}>• {displayWallet?.bank_name || '—'}</Text>
              </View>
              <View style={styles.copyBadge}>
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={14} color={COLORS.primary} />
                <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
              </View>
            </TouchableOpacity>

            <View style={{ marginTop: 8, marginBottom: 20 }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.weights.semibold, textTransform: 'uppercase' }}>
                {userName}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconCircle}>
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>Add Money</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconCircle}>
                  <Ionicons name="arrow-up" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconCircle}>
                  <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconCircle}>
                  <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>Request</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabRow}>
          {WALLET_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <View>
            {/* Quick Stats */}
            <View style={styles.overviewStatsRow}>
              <View style={styles.overviewStatCard}>
                <Text style={styles.overviewStatLabel}>Savings</Text>
                <Text style={styles.overviewStatValue}>₦{parseFloat(displayWallet?.savings_balance || '0').toLocaleString()}</Text>
              </View>
              <View style={styles.overviewStatCard}>
                <Text style={styles.overviewStatLabel}>Escrow</Text>
                <Text style={styles.overviewStatValue}>₦{parseFloat(displayWallet?.escrow_balance || '0').toLocaleString()}</Text>
              </View>
            </View>

            {/* Financial Services */}
            <Text style={styles.sectionTitle}>Financial Services</Text>
            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('SavingsScreen')}>
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="leaf-outline" size={22} color="#10B981" />
              </View>
              <View style={styles.serviceTextContent}>
                <Text style={styles.serviceTitle}>Micro-Savings</Text>
                <Text style={styles.serviceSubtitle}>₦{parseFloat(displaySavings.balance).toLocaleString()} saved • {displaySavings.annual_interest_rate}% annual interest</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('LoansScreen')}>
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Ionicons name="cash-outline" size={22} color="#3B82F6" />
              </View>
              <View style={styles.serviceTextContent}>
                <Text style={styles.serviceTitle}>Micro-Loans</Text>
                <Text style={styles.serviceSubtitle}>Up to ₦10,000 • 5% interest</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('InsuranceScreen')}>
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#A855F7" />
              </View>
              <View style={styles.serviceTextContent}>
                <Text style={styles.serviceTitle}>Micro-Insurance</Text>
                <Text style={styles.serviceSubtitle}>₦200/day • ₦50,000 coverage</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* Recent Transactions */}
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setActiveTab('Transactions')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
                {displayTransactions.slice(0, 3).map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} formatDate={formatDate} formatTime={formatTime} />
            ))}
          </View>
        )}

        {activeTab === 'Transactions' && (
          <View>
            <Text style={styles.transactionDateHeader}>May 2026</Text>
            {displayTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} formatDate={formatDate} formatTime={formatTime} />
            ))}
          </View>
        )}

        {activeTab === 'Savings' && (
          <View>
            <View style={styles.savingsCard}>
              <View style={styles.savingsHeader}>
                <Text style={styles.savingsLabel}>SAVINGS BALANCE</Text>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>
              <Text style={styles.savingsBalance}>₦{parseFloat(displaySavings.balance).toLocaleString()}.00</Text>
              <View style={styles.savingsStatRow}>
                <View style={styles.savingsStat}>
                  <Text style={styles.savingsStatLabel}>Interest Earned</Text>
                  <Text style={styles.savingsStatValue}>₦{parseFloat(displaySavings.total_interest_earned).toLocaleString()}</Text>
                </View>
                <View style={styles.savingsStatDivider} />
                <View style={styles.savingsStat}>
                  <Text style={styles.savingsStatLabel}>Annual Rate</Text>
                  <Text style={styles.savingsStatValue}>{displaySavings.annual_interest_rate}%</Text>
                </View>
              </View>
            </View>

            <View style={styles.savingsActions}>
              <TouchableOpacity style={styles.savingsActionBtn}>
                <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                <Text style={styles.savingsActionText}>Save More</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savingsWithdrawBtn}>
                <Ionicons name="arrow-down-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.savingsWithdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Savings History</Text>
            {displayTransactions.filter(t => t.description?.includes('savings')).map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} formatDate={formatDate} formatTime={formatTime} />
            ))}
            {displayTransactions.filter(t => t.description?.includes('savings')).length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={40} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>Your savings deposits will appear here</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
          </ScrollView>

          <BottomNav
            activeTab="WalletScreen"
            onTabPress={(tab) => navigation.navigate(tab)}
            tabs={getNavTabs() as any}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const TransactionItem = ({ transaction, formatDate, formatTime }: any) => {
  const isCredit = transaction.type === 'credit';
  return (
    <View style={txStyles.container}>
      <View style={[txStyles.iconBox, { backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
        <Ionicons
          name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={18}
          color={isCredit ? '#10B981' : '#EF4444'}
        />
      </View>
      <View style={txStyles.details}>
        <Text style={txStyles.description} numberOfLines={1}>{transaction.description}</Text>
        <Text style={txStyles.date}>{formatDate(transaction.created_at)} • {formatTime(transaction.created_at)}</Text>
      </View>
      <Text style={[txStyles.amount, { color: isCredit ? '#10B981' : '#EF4444' }]}>
        {isCredit ? '+' : '-'}₦{parseFloat(transaction.amount).toLocaleString()}
      </Text>
    </View>
  );
};

const txStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  amount: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
});

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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 24,
    marginBottom: SPACING.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currency: {
    fontSize: 28,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  balanceAmount: {
    fontSize: 38,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  decimal: {
    fontSize: 22,
    fontFamily: FONTS.weights.medium,
    color: 'rgba(255,255,255,0.6)',
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  accountInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  bankName: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: 'rgba(255,255,255,0.6)',
  },
  copyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.pill,
    gap: 4,
  },
  copyText: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontFamily: FONTS.weights.semibold,
    color: 'rgba(255,255,255,0.9)',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  overviewStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  overviewStatCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  overviewStatLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  overviewStatValue: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceTextContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
  },
  transactionDateHeader: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  savingsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: SPACING.lg,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsLabel: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  activeText: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  savingsBalance: {
    fontSize: 34,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: 20,
  },
  savingsStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsStat: {
    flex: 1,
    alignItems: 'center',
  },
  savingsStatLabel: {
    fontSize: 11,
    fontFamily: FONTS.weights.medium,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  savingsStatValue: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  savingsStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  savingsActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  savingsActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  savingsActionText: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  savingsWithdrawBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  savingsWithdrawText: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  errorText: {
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.button,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.weights.semibold,
    fontSize: 14,
  },
});
