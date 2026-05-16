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
import { getJobsFeed, getMyJobs } from '../../services/jobsService'
import { getWallet } from '../../services/walletService'
import { checkLoanEligibility } from '../../services/financialService'
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
  const [myJobs, setMyJobs] = useState<any[]>([]);
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

      const [walletData, jobsData, eligibilityData, myJobsData] = await Promise.all([
        getWallet(),
        getJobsFeed(),
        checkLoanEligibility().catch(() => null),
        getMyJobs().catch(() => []),
      ])

      if (walletData) setWallet(walletData)
      setJobsFeed(Array.isArray(jobsData) ? jobsData : [])
      console.log('📋 Home load jobs sample:', (Array.isArray(jobsData) ? jobsData : []).slice(0,5).map(j => ({ id: j.id, title: j.title, skill_required: j.skill_required, skills: j.skills })))
      setMyJobs(Array.isArray(myJobsData) ? myJobsData : [])
      
      if (eligibilityData && eligibilityData.score !== undefined) {
        useAppStore.getState().setEisScore(eligibilityData.score);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Failed to load home data'));
    }
  };

  const displayWallet = wallet;
  const displayUser = user;
  const displayJobs = jobs as any[];
  const eisScore = useAppStore((state) => state.eisScore);
  const firstName = displayUser?.full_name?.split(' ')[0] || 'there';

  // Client-side skill matching: prioritize jobs matching user's skills and location
  const userSkills = (displayUser?.skills || []).map((s: string) => String(s).toLowerCase());
  const userCity = (displayUser?.location_city || '').toLowerCase();
  
  const matchedJobs = displayJobs.filter((job: any) => {
    const jobSkills = Array.isArray(job.skills) ? job.skills.map((s: any) => String(s).toLowerCase()) : [String(job.skill_required ?? '').toLowerCase()];
    const jobCity = (job.location_city || '').toLowerCase();
    const hasSkillMatch = jobSkills.some((skill: string) => userSkills.includes(skill));
    const hasCityMatch = userCity === jobCity || !userCity;
    return hasSkillMatch && hasCityMatch;
  });
  
  const unmatchedJobs = displayJobs.filter((job: any) => !matchedJobs.includes(job));
  const sortedDisplayJobs = [...matchedJobs, ...unmatchedJobs];

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
            score={eisScore}
            onPrimaryAction={() => navigation.navigate('WalletScreen')}
            onSecondaryAction={() => navigation.navigate('WalletScreen')}
          />
        </View>

        {/* EIS Score */}
        <View style={styles.section}>
          <ScoreCard
            score={eisScore}
          />
        </View>

        {/* Financial Services */}
        <View style={styles.section}>
          <SectionHeader title="Your Progress" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <ProgressCard
              title="Savings"
              subtitle="Manage your savings"
              icon="leaf-outline"
              iconColor="#10B981"
              bgColor="rgba(16, 185, 129, 0.1)"
              active
              onPress={() => navigation.navigate('SavingsScreen')}
            />
            <ProgressCard
              title="Insurance"
              subtitle="Tap to activate"
              icon="shield-outline"
              iconColor={COLORS.primary}
              bgColor={COLORS.badgeGreen}
              onPress={() => navigation.navigate('InsuranceScreen')}
            />
            <ProgressCard
              title="Loans"
              subtitle="Check eligibility"
              icon="cash-outline"
              iconColor={COLORS.textMuted}
              bgColor={COLORS.surfaceAlt}
              onPress={() => navigation.navigate('LoansScreen')}
            />
          </ScrollView>
        </View>

        {/* My Accepted Gigs */}
        <View style={styles.section}>
          <SectionHeader
            title="My Accepted Gigs"
            onViewAll={() => navigation.navigate('MyJobs')}
          />

          {myJobs
            .filter((j) => j?.status === 'accepted' || j?.status === 'ongoing' || j?.status === 'active')
            .slice(0, 3)
            .map((job) => {
              const rawRating = job.employer_rating ?? job.employerRating ?? 0
              const safeRating =
                typeof rawRating === 'number'
                  ? rawRating
                  : typeof rawRating === 'string'
                    ? Number(rawRating)
                    : 0

              const rawEmployer = job.employer_name ?? job.employer ?? 'Employer'
              const safeEmployer = typeof rawEmployer === 'string' ? rawEmployer : 'Employer'

              const rawPay = job.pay_per_worker ?? job.pay ?? job.amount ?? 0
              const safePay =
                typeof rawPay === 'number'
                  ? rawPay
                  : typeof rawPay === 'string'
                    ? Number(rawPay)
                    : 0

              const rawMatch = job.match_score ?? job.matchScore ?? 0
              const safeMatch = typeof rawMatch === 'number' ? rawMatch : Number(rawMatch || 0)

              return (
                <GigCard
                  key={job.job_id || job.id}
                  title={typeof job.title === 'string' ? job.title : String(job.title ?? '')}
                  employer={safeEmployer}
                  rating={Number.isFinite(safeRating) ? safeRating : 0}
                  pay={formatCurrency(Number.isFinite(safePay) ? safePay : 0)}
                  match={Number.isFinite(safeMatch) && safeMatch > 0 ? safeMatch : 98}
                  icon={SKILL_ICON_MAP[job.skill_required] || 'briefcase-outline'}
                  onPress={() => navigation.navigate('GigDetail', { job })}
                />
              )
            })}

          {myJobs.filter((j) => j?.status === 'accepted' || j?.status === 'ongoing' || j?.status === 'active').length === 0 && (
            <Text style={{ fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, marginTop: 8 }}>
              You haven’t accepted any gigs yet.
            </Text>
          )}
        </View>

        {/* Jobs Near You */}
        <View style={styles.section}>
          <SectionHeader
            title="Jobs Near You"
            onViewAll={() => navigation.navigate('JobsFeed')}
          />

          {sortedDisplayJobs.map((job) => {
            const rawRating = job.employer_rating ?? 0
            const safeRating =
              typeof rawRating === 'number'
                ? rawRating
                : typeof rawRating === 'string'
                  ? Number(rawRating)
                  : rawRating && typeof rawRating === 'object'
                    ? Number((rawRating as any).avg_rating ?? (rawRating as any).rating ?? 0)
                    : 0

            const rawEmployer = job.employer_name ?? job.employer ?? 'Employer'
            const safeEmployer =
              typeof rawEmployer === 'string'
                ? rawEmployer
                : rawEmployer && typeof rawEmployer === 'object'
                  ? (rawEmployer as any).business_name ||
                    (rawEmployer as any).full_name ||
                    (rawEmployer as any).phone ||
                    'Employer'
                  : String(rawEmployer)

            const rawPay = job.pay_per_worker ?? job.pay ?? job.amount ?? 0
            const safePay =
              typeof rawPay === 'number'
                ? rawPay
                : typeof rawPay === 'string'
                  ? Number(rawPay)
                  : rawPay && typeof rawPay === 'object'
                    ? Number((rawPay as any).amount ?? (rawPay as any).pay ?? 0)
                    : 0

            const rawMatch = job.match_score ?? job.matchScore ?? 0
            const safeMatch =
              typeof rawMatch === 'number'
                ? rawMatch
                : typeof rawMatch === 'string'
                  ? Number(rawMatch)
                  : rawMatch && typeof rawMatch === 'object'
                    ? Number((rawMatch as any).score ?? (rawMatch as any).match ?? 0)
                    : 0

            return (
              <GigCard
                key={job.job_id || job.id}
                title={typeof job.title === 'string' ? job.title : String(job.title ?? '')}
                employer={safeEmployer}
                rating={Number.isFinite(safeRating) ? safeRating : 0}
                pay={formatCurrency(Number.isFinite(safePay) ? safePay : 0)}
                match={Number.isFinite(safeMatch) ? safeMatch : 0}
                icon={SKILL_ICON_MAP[job.skill_required] || 'briefcase-outline'}
                onPress={() => navigation.navigate('GigDetail', { job })}
              />
            )
          })}
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
