import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { WalletCard } from '../../components/ui/WalletCard';
import { GigCard } from '../../components/ui/GigCard';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/auth'
import { getJobsFeed } from '../../services/jobsService';
import { getWallet } from '../../services/walletService';
import { getErrorMessage } from '../../utils/handleApiError';

const NAV_TABS = [
  { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'JobsFeed', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'JobseekerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

const SKILL_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  delivery: 'bicycle-outline',
  market: 'storefront-outline',
  construction: 'hammer-outline',
  cleaning: 'sparkles-outline',
  security: 'shield-outline',
  cooking: 'restaurant-outline',
};

export default function HomeScreen({ navigation }: any) {
  const wallet = useAppStore((state) => state.wallet);
  const user = useAppStore((state) => state.user);
  const jobs = useAppStore((state) => state.jobsFeed);
  const [loadError, setLoadError] = useState<string | null>(null);

  const setWallet = useAppStore((state) => state.setWallet);
  const setUser = useAppStore((state) => state.setUser);
  const setJobsFeed = useAppStore((state) => state.setJobsFeed);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadError(null);
      const profileData = await authService.getProfile();
      
      if (profileData) {
        setUser(profileData);
      }

      const [walletData, jobsData] = await Promise.all([
        getWallet(),
        getJobsFeed(),
      ])

      if (walletData) setWallet(walletData)
      setJobsFeed(Array.isArray(jobsData) ? jobsData : [])
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Failed to load home data'));
    }
  };

  const displayWallet = wallet;
  const displayUser = user;
  const firstName = displayUser?.full_name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader
        userName={firstName}
        greeting="Good Morning,"
        onNotificationPress={() => {}}
        onProfilePress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wallet Balance Card */}
        <View style={styles.section}>
          <WalletCard
            balance={formatNumber(parseFloat(displayWallet?.balance || '0'))}
            score={displayUser?.eis_score || 0}
            onPrimaryAction={() => navigation.navigate('WalletScreen')}
            onSecondaryAction={() => navigation.navigate('WalletScreen')}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(27, 77, 62, 0.08)' }]}>
              <Ionicons name="briefcase-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Gigs Done</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(244, 114, 30, 0.08)' }]}>
              <Ionicons name="cash-outline" size={16} color={COLORS.accent} />
            </View>
            <Text style={styles.statValue}>₦42.5K</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
              <Ionicons name="star-outline" size={16} color="#10B981" />
            </View>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* EIS Score */}
        <View style={styles.section}>
          <ScoreCard
            score={displayUser?.eis_score || 0}
            tier="Tier 2: Savings Active"
            gigsCompleted={12}
            ptsToNext={33}
          />
        </View>

        {/* Unlock Progress */}
        <View style={styles.unlockCard}>
          <View style={styles.unlockHeader}>
            <View style={styles.unlockIconBox}>
              <Ionicons name="lock-open-outline" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.unlockLabel}>Next Unlock</Text>
              <Text style={styles.unlockFeature}>Micro-Loans</Text>
            </View>
            <View style={styles.unlockBadge}>
              <Text style={styles.unlockBadgeText}>80 pts</Text>
            </View>
          </View>
          <Text style={styles.unlockRequirement}>Complete more gigs to unlock micro-loans</Text>
          <View style={styles.unlockProgressRow}>
            <View style={styles.unlockProgressBg}>
              <View style={[styles.unlockProgressFill, { width: '67%' }]} />
            </View>
            <Text style={styles.unlockProgressText}>67/100</Text>
          </View>
        </View>

        {/* Financial Services */}
        <View style={styles.section}>
          <SectionHeader title="Your Progress" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <ProgressCard
              title="Savings"
              subtitle="₦3,000 saved"
              icon="leaf-outline"
              iconColor="#10B981"
              bgColor="rgba(16, 185, 129, 0.1)"
              active
              onPress={() => {}}
            />
            <ProgressCard
              title="Insurance"
              subtitle="Tap to activate"
              icon="shield-outline"
              iconColor={COLORS.primary}
              bgColor={COLORS.badgeGreen}
              onPress={() => {}}
            />
            <ProgressCard
              title="Loans"
              subtitle="13 pts to unlock"
              icon="cash-outline"
              iconColor={COLORS.textMuted}
              bgColor={COLORS.surfaceAlt}
              locked
              onPress={() => {}}
            />
          </ScrollView>
        </View>

        {/* Jobs Near You */}
        <View style={styles.section}>
          <SectionHeader
            title="Jobs Near You"
            onViewAll={() => navigation.navigate('JobsFeed')}
          />
            {jobs.map((job) => (
            <GigCard
              key={job.job_id || job.id}
              title={job.title}
              employer={job.employer_name || job.employer || 'Employer'}
              rating={job.employer_rating}
              pay={formatCurrency(job.pay_per_worker)}
              match={job.match_score}
              icon={SKILL_ICON_MAP[job.skill_required] || 'briefcase-outline'}
              onPress={() => navigation.navigate('GigDetail', { job })}
            />
          ))}
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav
        activeTab="Home"
        onTabPress={(tab) => navigation.navigate(tab)}
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ProgressCard = ({ title, subtitle, icon, iconColor, bgColor, active, locked, onPress }: any) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.progressCard, active && styles.progressActive]}>
    <View style={[styles.progressIcon, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <Text style={styles.progressTitle}>{title}</Text>
    <Text style={styles.progressSubtitle}>{subtitle}</Text>
    {locked && (
      <View style={styles.lockedBadge}>
        <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />
        <Text style={styles.lockedText}>Locked</Text>
      </View>
    )}
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
  section: {
    marginTop: SPACING.xl,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.weights.medium,
    marginTop: 2,
  },
  statValue: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: FONTS.weights.bold,
  },
  unlockCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xl,
  },
  unlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unlockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unlockLabel: {
    fontSize: 11,
    color: COLORS.primary,
    fontFamily: FONTS.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unlockFeature: {
    fontSize: 17,
    color: COLORS.text,
    fontFamily: FONTS.weights.bold,
  },
  unlockBadge: {
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.pill,
  },
  unlockBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontFamily: FONTS.weights.bold,
  },
  unlockRequirement: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONTS.weights.regular,
    marginBottom: 14,
    marginLeft: 48,
  },
  unlockProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 48,
  },
  unlockProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 3,
  },
  unlockProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  unlockProgressText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.weights.medium,
  },
  horizontalScroll: {
    marginHorizontal: -LAYOUT.paddingHorizontal,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  progressCard: {
    width: 150,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.badgeGreen,
  },
  progressIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  progressSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.pill,
    alignSelf: 'flex-start',
  },
  lockedText: {
    fontSize: 10,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
  },
});
