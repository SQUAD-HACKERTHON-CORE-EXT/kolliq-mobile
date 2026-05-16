import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { getJobsFeedResponse } from '../../services/jobsService';
import { getErrorMessage } from '../../utils/handleApiError';

const NAV_TABS = [
  { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'JobsFeed', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'JobseekerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export default function JobsFeedScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedCount, setFeedCount] = useState(0);
  const [feedMessage, setFeedMessage] = useState('');

  const jobsFeed = useAppStore((state) => state.jobsFeed);
  const jobsLoading = useAppStore((state) => state.jobsLoading);
  const user = useAppStore((state) => state.user);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const setJobsFeed = useAppStore((state) => state.setJobsFeed);
  const setJobsLoading = useAppStore((state) => state.setJobsLoading);

  const loadJobs = useCallback(async () => {
    try {
      setLoadError(null);
      setJobsLoading(true);
      const response = await getJobsFeedResponse();
      // Use fresh API response directly – overwrites store to avoid stale cache
      setJobsFeed(Array.isArray(response.jobs) ? response.jobs : []);
      setFeedCount(response.count ?? 0);
      setFeedMessage(response.message ?? '');
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Failed to load jobs'));
    } finally {
      setJobsLoading(false);
    }
  }, [setJobsFeed, setJobsLoading]);

  // Re-fetch every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [loadJobs])
  );

  const jobs = jobsFeed as any[];

  const filteredJobs = jobs.filter((job) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true;

    return [job.title, job.location_area, job.employer_name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  // Client-side skill matching: prioritize jobs matching user's skills and location
  const userSkills = (user?.skills || []).map((s: string) => String(s).toLowerCase());
  const userCity = (user?.location_city || '').toLowerCase();
  
  const matchedJobs = filteredJobs.filter((job: any) => {
    const jobSkills = Array.isArray(job.skills) ? job.skills.map((s: any) => String(s).toLowerCase()) : [String(job.skill_required ?? '').toLowerCase()];
    const jobCity = (job.location_city || '').toLowerCase();
    const hasSkillMatch = jobSkills.some((skill: string) => userSkills.includes(skill));
    const hasCityMatch = userCity === jobCity || !userCity;
    return hasSkillMatch && hasCityMatch;
  });
  
  const unmatchedJobs = filteredJobs.filter((job: any) => !matchedJobs.includes(job));
  const sortedJobs = [...matchedJobs, ...unmatchedJobs];

  const emptyMessage = feedMessage || 'No matching jobs right now. Check back soon!';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Jobs Feed</Text>
          <Text style={styles.headerSubtitle}>{user?.location_city || 'Nearby'} • {feedCount || jobs.length} jobs available</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Job Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {jobsLoading && !jobsFeed.length ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1B4D3E" />
          </View>
          ) : loadError ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
              <Text style={styles.emptyTitle}>{loadError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadJobs}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
        ) : sortedJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>{emptyMessage}</Text>
            <Text style={styles.emptySubtitle}>Top matched jobs for workers only.</Text>
            {jobsLoading === false && (
              <TouchableOpacity style={styles.retryButton} onPress={loadJobs}>
                <Text style={styles.retryButtonText}>Refresh feed</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          sortedJobs.map((job) => {
            const rawEmployerRating = job.employer_rating ?? 0
            const safeEmployerRating =
              typeof rawEmployerRating === 'number'
                ? rawEmployerRating
                : typeof rawEmployerRating === 'string'
                  ? Number(rawEmployerRating)
                  : rawEmployerRating && typeof rawEmployerRating === 'object'
                    ? Number(
                        (rawEmployerRating as any).avg_rating ??
                        (rawEmployerRating as any).rating ??
                        0
                      )
                    : 0

            const rawMatch = job.match_score ?? 0
            const safeMatch =
              typeof rawMatch === 'number'
                ? rawMatch
                : typeof rawMatch === 'string'
                  ? Number(rawMatch)
                  : rawMatch && typeof rawMatch === 'object'
                    ? Number((rawMatch as any).score ?? (rawMatch as any).match ?? 0)
                    : 0

            const rawPay = job.pay_per_worker ?? job.pay ?? 0
            const safePay =
              typeof rawPay === 'number'
                ? rawPay
                : typeof rawPay === 'string'
                  ? Number(rawPay)
                  : rawPay && typeof rawPay === 'object'
                    ? Number((rawPay as any).amount ?? (rawPay as any).pay ?? 0)
                    : 0

            const rawDuration = job.duration_hours ?? job.duration ?? 0
            const safeDuration =
              typeof rawDuration === 'number'
                ? rawDuration
                : typeof rawDuration === 'string'
                  ? Number(rawDuration)
                  : rawDuration && typeof rawDuration === 'object'
                    ? Number((rawDuration as any).duration_hours ?? 0)
                    : 0

            const rawDistance = job.distance_km ?? job.distance ?? 0
            const safeDistance =
              typeof rawDistance === 'number'
                ? rawDistance
                : typeof rawDistance === 'string'
                  ? Number(rawDistance)
                  : rawDistance && typeof rawDistance === 'object'
                    ? Number((rawDistance as any).distance_km ?? 0)
                    : 0

            return (
              <TouchableOpacity
                key={job.id}
                activeOpacity={0.8}
                style={styles.jobCard}
                onPress={() => navigation.navigate('GigDetail', { job })}
              >
                {/* Card Header */}
                <View style={styles.jobCardHeader}>
                  <View style={styles.jobIconBox}>
                    <Ionicons name="briefcase-outline" size={22} color={COLORS.primary} />
                  </View>
                  <View style={styles.matchBadge}>
                    <Ionicons
                      name="flash"
                      size={12}
                      color={safeMatch >= 80 ? COLORS.primary : COLORS.accent}
                    />
                    <Text
                      style={[
                        styles.matchText,
                        safeMatch >= 80 && { color: COLORS.primary },
                      ]}
                    >
                      {safeMatch}% Match
                    </Text>
                  </View>
                </View>

                {/* Job Title & Employer */}
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.employerRow}>
                  <Text style={styles.employerName}>
                    {typeof job.employer_name === 'string'
                      ? job.employer_name
                      : (job.employer_name as any)?.business_name ||
                        (job.employer_name as any)?.full_name ||
                        'Employer'}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>
                      {Number.isFinite(safeEmployerRating) ? safeEmployerRating : 0}
                    </Text>
                  </View>
                </View>

                {/* Job Details Row */}
                <View style={styles.jobDetailsRow}>
                  <View style={styles.jobDetail}>
                    <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.jobDetailText}>
                      {formatCurrency(Number.isFinite(safePay) ? safePay : 0)}
                    </Text>
                  </View>
                  <View style={styles.jobDetail}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.jobDetailTextMuted}>{safeDuration}hrs</Text>
                  </View>
                  <View style={styles.jobDetail}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.jobDetailTextMuted}>{safeDistance}km</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.jobCardBottom}>
                  <View style={styles.locationPill}>
                    <Ionicons name="navigate-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.locationText}>{job.location_area}</Text>
                  </View>
                  <Text style={styles.ratingText}>
                    {Number.isFinite(safeEmployerRating) ? safeEmployerRating : 0} rating
                  </Text>
                </View>

                {/* Breakdown */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownChip}>
                    <Text style={styles.breakdownLabel}>Location</Text>
                    <Text style={styles.breakdownValue}>{job.score_breakdown?.location ?? 0}</Text>
                  </View>
                  <View style={styles.breakdownChip}>
                    <Text style={styles.breakdownLabel}>Skill</Text>
                    <Text style={styles.breakdownValue}>{job.score_breakdown?.skill ?? 0}</Text>
                  </View>
                  <View style={styles.breakdownChip}>
                    <Text style={styles.breakdownLabel}>Availability</Text>
                    <Text style={styles.breakdownValue}>{job.score_breakdown?.availability ?? 0}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav
        activeTab="JobsFeed"
        onTabPress={(tab) => {
          if (tab === 'JobsFeed') {
            loadJobs();
            return;
          }

          navigation.navigate(tab);
        }}
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
    alignItems: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.input,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.sm,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  jobIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.pill,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.accent,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  employerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  employerName: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  jobDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  jobDetailTextMuted: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  jobCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.primary,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  breakdownChip: {
    flex: 1,
    borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
  },
  breakdownLabel: {
    fontSize: 10,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
