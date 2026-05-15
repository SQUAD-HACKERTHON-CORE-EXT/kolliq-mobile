import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Card } from '../../components/ui/Card';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { WalletCard } from '../../components/ui/WalletCard';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { getMyJobs } from '../../services/jobsService';
import { getWallet } from '../../services/walletService';

const NAV_TABS = [
  { id: 'EmployerDashboard', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
  { id: 'Workers', label: 'Workers', icon: 'people-outline' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline' },
  { id: 'EmployerProfile', label: 'Profile', icon: 'person-outline' },
] as const;

export default function DashboardScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user)
  const [wallet, setWallet] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoadingJobs(true)
      setLoadingWallet(true)
      try {
        const myJobs = await getMyJobs()
        const data: any = myJobs as any
        setJobs(Array.isArray(data) ? data : (data?.jobs ?? data?.results ?? []))
      } catch (e) {
        setJobs([])
      } finally {
        setLoadingJobs(false)
      }

      try {
        const w = await getWallet()
        setWallet(w?.wallet ?? w)
      } catch (e) {
        setWallet(null)
      } finally {
        setLoadingWallet(false)
      }
    }

    load()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader 
        userName={user?.business_name ?? user?.full_name ?? 'Employer'} 
        greeting="Employer Dashboard"
        onNotificationPress={() => {}} 
        onProfilePress={() => navigation.navigate('EmployerProfile')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Post Job Hero */}
        <TouchableOpacity activeOpacity={0.9} style={styles.heroButton} onPress={() => navigation.navigate('PostJob')}>
          <Card background={COLORS.primary} style={styles.heroCard}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="add" size={32} color={COLORS.primaryLight} />
            </View>
            <View>
              <Text style={styles.heroTitle}>Post a New Job</Text>
              <Text style={styles.heroSubtitle}>Find reliable workers instantly</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <View style={styles.section}>
          <WalletCard 
            title="Escrow Wallet Balance"
            balance={loadingWallet ? '—' : formatNumber(wallet?.balance ?? 0)}
            primaryActionTitle="+ Fund Escrow"
            secondaryActionTitle="History"
            onPrimaryAction={() => {}}
            onSecondaryAction={() => {}}
          >
            <Text style={styles.escrowDisclaimer}>
              Funds held securely in Squad escrow until job is confirmed complete
            </Text>
          </WalletCard>
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Active Postings" 
            onViewAll={() => {}} 
          />
          {loadingJobs ? (
            <Text>Loading postings…</Text>
          ) : jobs.length === 0 ? (
            <Text style={{ color: COLORS.textSecondary }}>No active postings</Text>
          ) : (
            jobs.map((job: any) => (
              <JobPostingCard 
                key={job.id}
                title={job.title}
                posted={`Posted ${job.createdAt ?? ''}`}
                applicants={job.workers_needed ?? 0}
                onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Top Rated Workers in your area" 
            onViewAll={() => {}} 
          />
          <Text style={{ color: COLORS.textSecondary }}>Top workers coming soon.</Text>
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="EmployerDashboard" 
        onTabPress={(tab) => navigation.navigate(tab)} 
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  )
}

const JobPostingCard = ({ title, posted, applicants, onPress }: any) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <Card variant="outline" style={styles.jobCard}>
      <View style={styles.jobIconPlaceholder} />
      <View style={styles.jobTextContainer}>
        <Text style={styles.jobTitle}>{title}</Text>
        <Text style={styles.jobSubtitle}>{posted} • {applicants} Applicants</Text>
      </View>
    </Card>
  </TouchableOpacity>
);

const RecentHireCard = ({ name, rating, role, amount, status }: any) => (
  <Card variant="outline" style={styles.hireCard}>
    <View style={styles.hireTop}>
      <View style={styles.hireInfo}>
        <View style={styles.hireAvatar} />
        <View style={styles.hireMeta}>
          <Text style={styles.hireName}>{name}</Text>
          <Text style={styles.hireSub}>{rating} Worker Rating</Text>
        </View>
      </View>
      <View style={styles.hireBadge}>
        <Text style={styles.hireText}>Hire</Text>
      </View>
    </View>
    <View style={styles.hireDivider} />
    <View style={styles.hireBottom}>
      <Text style={styles.hireBottomText}>{role}</Text>
      <Text style={styles.hireBottomText}>EIS Score: <Text style={styles.boldText}>450</Text></Text>
    </View>
  </Card>
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
  heroButton: {
    marginTop: SPACING.md,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  section: {
    marginTop: SPACING['2xl'],
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  jobIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1F1',
    marginRight: SPACING.md,
  },
  jobTextContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  jobSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hireCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  hireTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hireInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hireAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceAlt,
    marginRight: SPACING.md,
  },
  hireMeta: {
    justifyContent: 'center',
  },
  hireName: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  hireSub: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
  },
  hireBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  hireText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  escrowDisclaimer: {
    fontSize: 11,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  hireDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  hireBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hireBottomText: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
  },
  boldText: {
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
});

