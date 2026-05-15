import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { getProfile, logout } from '../../services/authService';
import { getWallet } from '../../services/walletService';
import { getMyJobs, getUserRatings } from '../../services/jobsService';

const NAV_TABS = [
  { id: 'EmployerDashboard', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
  { id: 'Workers', label: 'Workers', icon: 'people-outline' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline' },
  { id: 'EmployerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export default function EmployerProfile({ navigation }: any) {
  const storeUser = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const [jobsCount, setJobsCount] = useState(0)
  const [eisScore, setEisScore] = useState(0)
  const [ratings, setRatings] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      
      // Load profile
      const profile: any = await getProfile()
      if (profile) {
        setUser(profile)
        setEisScore(profile?.eis_score ?? 0)
      }

      // Load jobs count
      const myJobs: any = await getMyJobs()
      const jobsArray = Array.isArray(myJobs) ? myJobs : (myJobs?.jobs ?? myJobs?.results ?? [])
      setJobsCount(jobsArray.length)

      // Load ratings if user has ID
      if (profile?.id) {
        try {
          const userRatings: any = await getUserRatings(profile.id)
          const ratingsList = userRatings?.ratings ?? userRatings?.data ?? []
          setRatings(ratingsList)
          
          // Calculate average rating
          if (Array.isArray(ratingsList) && ratingsList.length > 0) {
            const avg = ratingsList.reduce((sum: number, r: any) => sum + (r.stars ?? r.rating ?? 0), 0) / ratingsList.length
            setAverageRating(parseFloat(avg.toFixed(1)))
          }
        } catch (e) {
          console.log('Error loading ratings:', e)
          setRatings([])
        }
      }
    } catch (e) {
      console.log('Error loading employer profile', e)
      setEisScore(0)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              setLoggingOut(true)
              await logout()
              // Navigate to the existing auth entry route
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            } catch (e) {
              console.error('Logout error:', e)
              Alert.alert('Error', 'Failed to logout. Please try again.')
              setLoggingOut(false)
            }
          },
          style: 'destructive',
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View style={styles.onlineDot} />
          <TouchableOpacity onPress={() => navigation.navigate('ChangePin')} style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Employer Profile</Text>
        <Text style={styles.title}>{useAppStore((s) => s.user?.business_name ?? s.user?.full_name ?? 'Employer')}</Text>

        {/* Rating Card */}
        <Card variant="elevated" style={styles.ratingCard}>
          <View style={styles.ratingIconContainer}>
            <View style={styles.ratingIcon}>
              <Ionicons name="star" size={32} color={COLORS.warning} />
            </View>
          </View>
          <Text style={styles.ratingValue}>{loading ? '—' : (averageRating || 'N/A')}</Text>
          <Text style={styles.ratingLabel}>Average Business Rating</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{loading ? '—' : jobsCount}</Text>
              <Text style={styles.statLabel}>Total Hires</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{loading ? '—' : eisScore}</Text>
              <Text style={styles.statLabel}>EIS Score</Text>
            </View>
          </View>
        </Card>

        {/* Trust Factors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Strength</Text>
          
          <View style={styles.trustItem}>
            <View style={[styles.trustIcon, { backgroundColor: COLORS.secondaryMuted }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.trustText}>
              <Text style={styles.trustTitle}>Economic Identity Score</Text>
              <Text style={styles.trustSubtitle}>
                Your EIS score of {eisScore} reflects your reliability and transaction history on Kolliq.
              </Text>
            </View>
          </View>

          {jobsCount > 0 && (
            <View style={styles.trustItem}>
              <View style={[styles.trustIcon, { backgroundColor: COLORS.badgeGreen }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.trustText}>
                <Text style={styles.trustTitle}>Active Employer</Text>
                <Text style={styles.trustSubtitle}>
                  You have posted {jobsCount} job{jobsCount !== 1 ? 's' : ''} and built credibility on the platform.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews from Workers</Text>
          
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: SPACING.lg }}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={{ color: COLORS.textMuted, marginTop: SPACING.md }}>Loading reviews…</Text>
            </View>
          ) : ratings.length === 0 ? (
            <Text style={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>No reviews yet. Start posting jobs to receive reviews from workers.</Text>
          ) : (
            ratings.slice(0, 3).map((rating, index) => {
              const rawRole = rating.by_role ?? rating.role ?? 'Worker'
              const safeRole =
                typeof rawRole === 'string'
                  ? rawRole
                  : rawRole && typeof rawRole === 'object'
                    ? JSON.stringify(rawRole)
                    : String(rawRole)

              const rawStars = rating.stars ?? rating.rating ?? 0
              const safeStars =
                typeof rawStars === 'number'
                  ? rawStars
                  : typeof rawStars === 'string'
                    ? Number(rawStars)
                    : // if backend returns an object (e.g. {avg_rating: ...}), stringify to avoid RN crash
                      Number(JSON.stringify(rawStars))

              const rawText = rating.comment ?? rating.review ?? 'No comment provided'
              const safeText =
                typeof rawText === 'string'
                  ? rawText
                  : rawText && typeof rawText === 'object'
                    ? JSON.stringify(rawText)
                    : String(rawText)

              return (
                <ReviewCard
                  key={index}
                  role={safeRole}
                  rating={safeStars}
                  text={safeText}
                />
              )
            })
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => navigation.navigate('ChangePin')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Change PIN</Text>
              <Text style={styles.settingSubtitle}>Update your security PIN</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutItem]} 
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                {loggingOut ? 'Logging out...' : 'Logout'}
              </Text>
              <Text style={styles.settingSubtitle}>Sign out of your account</Text>
            </View>
            {!loggingOut && <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textMuted} />}
            {loggingOut && <ActivityIndicator size="small" color={COLORS.primary} />}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="EmployerProfile" 
        onTabPress={(tab) => navigation.navigate(tab)} 
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ReviewCard = ({ role, rating, text }: any) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewRole}>{role}</Text>
      <View style={styles.reviewStars}>
        {[1,2,3,4,5].map(i => (
          <Ionicons 
            key={i} 
            name={i <= rating ? "star" : "star-outline"} 
            size={14} 
            color={COLORS.warning} 
          />
        ))}
      </View>
    </View>
    <Text style={styles.reviewText}>"{text}"</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  avatarPlaceholderSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 100,
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
    marginBottom: SPACING['2xl'],
  },
  ratingCard: {
    padding: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  ratingIconContainer: {
    marginBottom: SPACING.lg,
  },
  ratingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingValue: {
    fontSize: 48,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  section: {
    marginBottom: SPACING['3xl'],
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  trustText: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  trustSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  reviewCard: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reviewRole: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 15,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  logoutItem: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(27, 77, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
