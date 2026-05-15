import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/useAppStore';
import { getProfile, logout } from '../../services/authService';
import { getMyJobs, getUserRatings } from '../../services/jobsService';
import { checkLoanEligibility } from '../../services/financialService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_TABS = [
  { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'JobsFeed', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'JobseekerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export default function JobseekerProfile({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const storeUser = useAppStore((state) => state.user);
  const eisScore = useAppStore((state) => state.eisScore);
  const setUser = useAppStore((state) => state.setUser);
  const [gigsCount, setGigsCount] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setDataLoading(true);
      const profileRes = await getProfile();
      const profileData = profileRes?.data ?? profileRes;

      if (profileData) setUser(profileData);

      const userId = profileData?.id || storeUser?.id;
      const [myJobsData, ratingsData, eligibilityData] = await Promise.all([
        getMyJobs().catch(() => null),
        userId ? getUserRatings(userId).catch(() => null) : Promise.resolve(null),
        checkLoanEligibility().catch(() => null),
      ]);

      if (eligibilityData && eligibilityData.score !== undefined) {
        useAppStore.getState().setEisScore(eligibilityData.score);
      }

      // Compute gigs count
      if (myJobsData != null) {
        const jobsArr = Array.isArray(myJobsData)
          ? myJobsData
          : (myJobsData?.jobs ?? myJobsData?.results ?? []);
        setGigsCount(jobsArr.length);
      }

      // Compute average rating and reviews list
      if (ratingsData != null) {
        const ratingsArr = Array.isArray(ratingsData)
          ? ratingsData
          : (ratingsData?.ratings ?? ratingsData?.results ?? ratingsData?.data ?? []);
        if (ratingsArr.length > 0) {
          const total = ratingsArr.reduce((sum: number, r: any) => sum + (r.stars ?? r.rating ?? 0), 0);
          setAvgRating(parseFloat((total / ratingsArr.length).toFixed(1)));
          setReviews(ratingsArr);
        }
      }
    } catch (error) {
      console.log('Profile load error:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const user = storeUser;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButtonDanger} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChangePin')}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{user?.full_name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.name}>{user?.full_name || 'Profile'}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={14} color={COLORS.primary} /> {user?.location_city || '—'}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{eisScore}</Text>
            <Text style={styles.statLabel}>EIS Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            {dataLoading && gigsCount === null ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.statValue}>{gigsCount ?? '—'}</Text>
            )}
            <Text style={styles.statLabel}>Gigs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            {dataLoading && avgRating === null ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.statValue}>{avgRating ?? '—'}</Text>
            )}
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Skills</Text>
          <View style={styles.skillsContainer}>
            {(user?.skills || ['No skills yet']).map((skill, i) => (
              <View key={i} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {dataLoading && reviews.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : reviews.length === 0 ? (
            <Card variant="outline" style={styles.reviewCard}>
              <Text style={[styles.reviewText, { textAlign: 'center', fontStyle: 'normal' }]}>No reviews yet. Complete gigs to receive ratings.</Text>
            </Card>
          ) : (
            reviews.slice(0, 5).map((review: any, i: number) => (
              <Card key={review.id || i} variant="outline" style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewEmployer}>
                    {typeof (review.from_name || review.reviewer_name || review.employer_name) === 'string'
                      ? review.from_name || review.reviewer_name || review.employer_name
                      : (review.from_name as any)?.full_name ||
                        (review.reviewer_name as any)?.full_name ||
                        (review.employer_name as any)?.business_name ||
                        (review.employer_name as any)?.full_name ||
                        'Employer'}
                  </Text>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{review.stars ?? review.rating ?? 0}</Text>
                  </View>
                </View>
                {(review.comment || review.review) ? (
                  <Text style={styles.reviewText}>"{review.comment || review.review}"</Text>
                ) : null}
              </Card>
            ))
          )}
        </View>

        {/* Action Menu */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyJobs')}>
            <View style={styles.menuIconBox}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuText}>Gig History</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePin')}>
            <View style={styles.menuIconBox}>
              <Ionicons name="key-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuText}>Change PIN</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="help-buoy-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuText}>Support & Help</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => {
              Alert.alert('Log out', 'Do you want to sign out now?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out', style: 'destructive', onPress: handleLogout },
              ])
            }}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            </View>
            <Text style={[styles.menuText, { color: COLORS.error }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="JobseekerProfile" 
        onTabPress={(tab) => navigation.navigate(tab)} 
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
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
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconButtonDanger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarInitial: {
    fontSize: 32,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 24,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.pill,
  },
  skillText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.primary,
  },
  reviewCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewEmployer: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.pill,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: '#F59E0B',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  menuSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
});
