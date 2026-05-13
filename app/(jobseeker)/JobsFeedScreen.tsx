import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DUMMY_JOBS, DUMMY_USER } from '../../constants/dummyData';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { formatCurrency } from '../../utils/formatCurrency';

const NAV_TABS = [
  { id: 'JobseekerHome', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
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

const FILTER_CHIPS = ['All', 'Delivery', 'Market', 'Construction', 'Cleaning'];

export default function JobsFeedScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const jobs = DUMMY_JOBS;

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = activeFilter === 'All' || job.skill_required.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = !searchQuery || job.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Jobs Feed</Text>
          <Text style={styles.headerSubtitle}>{DUMMY_USER.location_city} • {jobs.length} jobs available</Text>
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

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer} contentContainerStyle={styles.chipContent}>
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, activeFilter === chip && styles.chipActive]}
            onPress={() => setActiveFilter(chip)}
          >
            <Text style={[styles.chipText, activeFilter === chip && styles.chipTextActive]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Job Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
            <TouchableOpacity
              key={job.job_id}
              activeOpacity={0.8}
              style={styles.jobCard}
              onPress={() => navigation.navigate('GigDetail', { job })}
            >
              {/* Card Header */}
              <View style={styles.jobCardHeader}>
                <View style={styles.jobIconBox}>
                  <Ionicons name={SKILL_ICON_MAP[job.skill_required] || 'briefcase-outline'} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.matchBadge}>
                  <Ionicons name="flash" size={12} color={job.match_score >= 80 ? COLORS.primary : COLORS.accent} />
                  <Text style={[styles.matchText, job.match_score >= 80 && { color: COLORS.primary }]}>{job.match_score}% Match</Text>
                </View>
              </View>

              {/* Job Title & Employer */}
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.employerRow}>
                <Text style={styles.employerName}>{job.employer_name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={styles.ratingText}>{job.employer_rating}</Text>
                </View>
              </View>

              {/* Job Details Row */}
              <View style={styles.jobDetailsRow}>
                <View style={styles.jobDetail}>
                  <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.jobDetailText}>{formatCurrency(job.pay_per_worker)}</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.jobDetailTextMuted}>{job.duration_hours}hrs</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.jobDetailTextMuted}>{job.distance_km}km</Text>
                </View>
              </View>

              {/* Bottom Row */}
              <View style={styles.jobCardBottom}>
                <View style={styles.locationPill}>
                  <Ionicons name="navigate-outline" size={12} color={COLORS.primary} />
                  <Text style={styles.locationText}>{job.location_area}</Text>
                </View>
                {job.escrow_funded && (
                  <View style={styles.escrowBadge}>
                    <Ionicons name="shield-checkmark" size={12} color={COLORS.primary} />
                    <Text style={styles.escrowText}>Escrow Funded</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav
        activeTab="JobsFeed"
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
  chipContainer: {
    maxHeight: 44,
    marginBottom: SPACING.md,
  },
  chipContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.sm,
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
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.pill,
  },
  escrowText: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
