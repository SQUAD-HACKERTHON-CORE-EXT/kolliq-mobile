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
          console.log('📑 RAW MY JOBS COUNT:', myJobs.length, 'USER ID:', user?.id)
          const allJobs = Array.isArray(myJobs) ? myJobs : [];
          // Defensive filter: ensure only jobs that belong to current user are shown
          // Handles: employer_id (number/string), employerId (string), employer (id or object)
          const filtered = allJobs.filter((j: any) => {
            const raw = j?.employer_id ?? j?.employerId ?? (typeof j?.employer === 'object' ? j?.employer?.id : j?.employer) ?? ''
            const jobEmployerId = typeof raw === 'object' ? String(raw?.id ?? raw?.pk ?? raw?.user_id ?? '') : String(raw)
            return jobEmployerId === String(user?.id ?? '')
          });
          console.log('📑 FILTERED JOBS COUNT:', filtered.length, '(filtered from', allJobs.length, 'total)');
          setJobs(filtered);
        } catch (e) {
        console.error('Error loading my jobs:', e);
        setJobs([])
      } finally {
        setLoadingJobs(false)
      }

      try {
        const w = await getWallet()
        setWallet(w)   // getWallet returns flat wallet object — no extra .wallet traversal
      } catch (e) {
        setWallet(null)
      } finally {
        setLoadingWallet(false)
      }
    }

    load()
  }, [])

  const isJobFunded = (job: any) => {
    if (!job) return false
    if (job.escrow_funded === true) return true
    if (job.is_funded === true) return true
    const fundingState = String(job.escrow_status ?? job.funding_status ?? '').toLowerCase()
    return fundingState === 'funded' || fundingState === 'completed' || fundingState === 'paid'
  }

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
            balance={loadingWallet ? '—' : formatNumber(wallet?.balance || 0)}
            score={user?.eis_score || 0}
            primaryActionTitle="+ Fund Escrow"
            secondaryActionTitle="History"
            onPrimaryAction={() => { console.log('Dashboard: Fund Escrow button pressed'); navigation.navigate('FundEscrow') }}
            onSecondaryAction={() => { console.log('Dashboard: Escrow history pressed'); navigation.navigate('WalletScreen') }}
          >
            <Text style={styles.escrowDisclaimer}>
              Funds held securely in Squad escrow until job is confirmed complete
            </Text>
          </WalletCard>
        </View>

        {/* Active Postings Stats */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{loadingJobs ? '—' : jobs.length}</Text>
                <Text style={styles.statLabel}>Active Postings</Text>
              </View>
              <Ionicons name="briefcase-outline" size={24} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
            </Card>
            
            <Card variant="elevated" style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {loadingJobs ? '—' : jobs.filter((j: any) => j.status === 'open' || !j.status).length}
                </Text>
                <Text style={styles.statLabel}>Open Positions</Text>
              </View>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.secondary} style={{ marginLeft: 'auto' }} />
            </Card>
          </View>
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
            jobs.map((job: any) => {
              const selectedJobId = job.id ?? job.job_id
              const funded = isJobFunded(job)
              const createdDate = job.created_at ? new Date(job.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : 'Recently'
              return (
                <JobPostingCard 
                  key={job.id ?? job.job_id}
                  title={job.title}
                  posted={`Posted on ${createdDate}`}
                  workersNeeded={job.workers_needed ?? 0}
                  payPerWorker={job.pay_per_worker ?? 0}
                  status={job.status ?? 'active'}
                  funded={funded}
                  onPress={() => {
                    navigation.navigate('JobDetail', {
                      jobId: selectedJobId,
                      id: selectedJobId,
                      job_id: selectedJobId,
                      job,
                    })
                  }}
                  onFundPress={() => navigation.navigate('FundEscrow', {
                    job_id: selectedJobId,
                    jobId: selectedJobId,
                    id: selectedJobId,
                    job,
                  })}
                />
              )
            })
          )}
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

const JobPostingCard = ({ title, posted, workersNeeded, payPerWorker, status, funded, onPress, onFundPress }: any) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <Card variant="outline" style={styles.jobCard}>
      <View style={[styles.jobIconPlaceholder, status === 'completed' ? { backgroundColor: '#E0F2FE' } : {}]} />
      <View style={styles.jobTextContainer}>
        <Text style={styles.jobTitle}>{title}</Text>
        <Text style={styles.jobSubtitle}>{posted} • {workersNeeded} worker{workersNeeded !== 1 ? 's' : ''} needed</Text>
        {payPerWorker > 0 && (
          <Text style={styles.jobPayRate}>₦{formatNumber(payPerWorker)} per worker</Text>
        )}
      </View>
      {funded ? (
        <View style={[styles.fundBadge, styles.fundedBadge]}>
          <Text style={[styles.fundBadgeText, styles.fundedBadgeText]}>Funded</Text>
        </View>
      ) : (
        <TouchableOpacity activeOpacity={0.85} onPress={onFundPress} style={[styles.fundBadge, styles.unfundedBadge]}>
          <Text style={[styles.fundBadgeText, styles.unfundedBadgeText]}>Fund</Text>
        </TouchableOpacity>
      )}
    </Card>
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
  jobPayRate: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
    marginTop: 4,
  },
  fundBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginLeft: SPACING.sm,
  },
  unfundedBadge: {
    backgroundColor: '#FFF7E6',
    borderColor: '#F8C471',
  },
  fundedBadge: {
    backgroundColor: '#EAF8EE',
    borderColor: '#9FD5AE',
  },
  fundBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
  },
  unfundedBadgeText: {
    color: '#B06A00',
  },
  fundedBadgeText: {
    color: '#1E7A3B',
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
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  boldText: {
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
});

