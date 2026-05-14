import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { WalletCard } from '../../components/ui/WalletCard';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { getCategories, getListings } from '../../services/marketplaceService';
import { getErrorMessage } from '../../utils/handleApiError';

const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline', activeIcon: 'grid' },
  { id: 'TraderHome', label: 'Market', icon: 'cart-outline' },
  { id: 'TraderHome', label: 'Identity', icon: 'finger-print-outline' },
  { id: 'TraderHome', label: 'Account', icon: 'person-outline' },
] as const;

export default function IdentityScreen({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [marketError, setMarketError] = useState('');

  const weeklyData = [
    { label: 'Wk 1', height: 40, color: COLORS.surfaceAlt },
    { label: 'Wk 2', height: 60, color: COLORS.surfaceAlt },
    { label: 'Wk 3', height: 85, color: COLORS.primary },
    { label: 'Wk 4', height: 100, color: COLORS.primary },
  ];

  useEffect(() => {
    const loadMarket = async () => {
      try {
        setLoadingMarket(true);
        setMarketError('');
        const [categoryData, listingData] = await Promise.all([
          getCategories(),
          getListings({ page: 1 }),
        ]);
        setCategories(categoryData);
        setListings(listingData);
      } catch (error: any) {
        setMarketError(getErrorMessage(error, 'Failed to load marketplace data'));
      } finally {
        setLoadingMarket(false);
      }
    };

    loadMarket();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader 
        userName="Ike's Workshop" 
        onNotificationPress={() => {}} 
        onProfilePress={() => {}}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.subtitle}>Financial Overview</Text>
          <Text style={styles.title}>Identity & Progress</Text>
        </View>

        <WalletCard 
          title="Available Balance"
          balance={formatNumber(0)}
          score={0}
          primaryActionTitle="Receive"
          secondaryActionTitle="Transfer"
          onPrimaryAction={() => {}}
          onSecondaryAction={() => {}}
        />

        <View style={styles.quickActionRow}>
          {['Send', 'Request', 'Scan QR', 'My QR'].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionBtnContainer}>
              <View style={styles.actionBtn}>
                <Ionicons 
                  name={i === 0 ? 'send' : i === 1 ? 'download' : i === 2 ? 'qr-code' : 'barcode'} 
                  size={20} 
                  color={COLORS.primary} 
                />
              </View>
              <Text style={styles.actionBtnLabel}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <ScoreCard 
            score={0} 
            tier="Starter Tier"
            gigsCompleted={0}
            ptsToNext={100}
          />
        </View>

        <View style={styles.loanCard}>
          <Text style={styles.loanLabel}>Unlock Working Capital Loans</Text>
          <Text style={styles.loanRequirement}>Process 50000 naira in payments to qualify for your first business loan</Text>
          <View style={styles.loanProgressRow}>
            <View style={styles.loanProgressBg}>
              <View style={[styles.loanProgressFill, { width: '0%' }]} />
            </View>
          </View>
          <View style={styles.loanAmounts}>
            <Text style={styles.loanAmountText}>0</Text>
            <Text style={styles.loanAmountText}>₦50,000</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Marketplace" onViewAll={() => {}} />
          {loadingMarket ? (
            <View style={styles.marketLoadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.marketLoadingText}>Loading live listings…</Text>
            </View>
          ) : marketError ? (
            <View style={styles.marketErrorCard}>
              <Text style={styles.marketErrorText}>{marketError}</Text>
            </View>
          ) : null}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>

          {listings.slice(0, 3).map((listing) => (
            <Card key={listing.id} variant="outline" style={styles.listingCard}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <Text style={styles.listingMeta}>{listing.location_city || 'Market listing'} • ₦{formatNumber(listing.price)}</Text>
              <Text style={styles.listingDesc} numberOfLines={2}>{listing.description}</Text>
            </Card>
          ))}

          {!loadingMarket && listings.length === 0 && !marketError ? (
            <View style={styles.emptyMarketState}>
              <Text style={styles.emptyMarketText}>No live listings yet.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Card variant="outline" style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Score Growth</Text>
                <Text style={styles.chartSubtitle}>Past 30 Days</Text>
              </View>
              <View style={styles.growthBadge}>
                <Text style={styles.growthText}>+12 Pts</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.barsContainer}>
                {weeklyData.map((data, index) => (
                  <View key={index} style={styles.barWrapper}>
                    <View style={[styles.bar, { height: `${data.height}%`, backgroundColor: data.color }]} />
                    <Text style={styles.barLabel}>{data.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recent Activity" onViewAll={() => {}} />
          <ActivityItem 
            title="Trade Payment Received" 
            desc="From: BuildTech Const." 
            amount="+ ₦15,000" 
            date="Today, 2:45 PM" 
          />
          <ActivityItem 
            title="Identity Score Update" 
            desc="Verification Bonus" 
            amount="+ 5 Pts" 
            date="Yesterday" 
            isScore
          />
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="TraderHome" 
        onTabPress={(tab) => navigation.navigate(tab)} 
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ActivityItem = ({ title, desc, amount, date, isScore }: any) => (
  <TouchableOpacity style={styles.activityRow}>
    <View style={styles.activityIcon}>
      <Ionicons 
        name={isScore ? "flash-outline" : "arrow-down-outline"} 
        size={20} 
        color={COLORS.primary} 
      />
    </View>
    <View style={styles.activityInfo}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDate}>{date} • {desc}</Text>
    </View>
    <Text style={[styles.activityAmount, { color: isScore ? COLORS.primary : COLORS.secondary }]}>
      {amount}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  section: {
    marginTop: SPACING.xl,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  actionBtnContainer: {
    alignItems: 'center',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.badgeGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
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
  loanProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
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
  loanAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanAmountText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.weights.medium,
  },
  marketLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  marketLoadingText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
  },
  marketErrorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 14,
    padding: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.18)',
  },
  marketErrorText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: '#B91C1C',
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  listingCard: {
    marginBottom: 10,
    padding: SPACING.lg,
  },
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
  emptyMarketState: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyMarketText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
  },
  chartCard: {
    padding: SPACING.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING['2xl'],
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  growthBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  growthText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.secondary,
  },
  chartContainer: {
    height: 120,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.sm,
  },
  barWrapper: {
    alignItems: 'center',
    width: 50,
  },
  bar: {
    width: 32,
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
});


