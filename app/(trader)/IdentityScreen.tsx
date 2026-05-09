import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { WalletCard } from '../../components/ui/WalletCard';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { formatCurrency } from '../../utils/formatCurrency';

const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline', activeIcon: 'grid' },
  { id: 'market', label: 'Market', icon: 'cart-outline' },
  { id: 'identity', label: 'Identity', icon: 'finger-print-outline' },
  { id: 'account', label: 'Account', icon: 'person-outline' },
] as const;

export default function IdentityScreen({ navigation }: any) {
  const weeklyData = [
    { label: 'Wk 1', height: 40, color: COLORS.surfaceAlt },
    { label: 'Wk 2', height: 60, color: COLORS.surfaceAlt },
    { label: 'Wk 3', height: 85, color: COLORS.primary },
    { label: 'Wk 4', height: 100, color: COLORS.primary },
  ];

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
          balance={formatCurrency(45200)}
          accountNumber="1234567890"
          onAddMoney={() => {}}
          onSend={() => {}}
        />

        <View style={styles.section}>
          <ScoreCard 
            score={55} 
            tier="Tier 3: Loans Unlocked"
            gigsCompleted={45}
            ptsToNext={6}
          />
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
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  section: {
    marginTop: SPACING['2xl'],
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
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
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
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
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
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
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
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
  },
});


