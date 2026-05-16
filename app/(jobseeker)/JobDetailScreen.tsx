import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { getJobDetail } from '../../services/jobsService';
import { COLORS, SPACING, LAYOUT, FONTS } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JobDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const user = useAppStore((state) => state.user);
  const [storedUserId, setStoredUserId] = React.useState<string | null>(null);
  const [storedRole, setStoredRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStored = async () => {
      try {
        const sid = await SecureStore.getItemAsync('user_id');
        const role = await SecureStore.getItemAsync('role');
        setStoredUserId(sid ?? null);
        setStoredRole(role ?? null);
      } catch (e) {
        // ignore
      }
    };
    loadStored();
  }, []);
  
  const [job, setJob] = useState<any>(params.job || params);
  const [loading, setLoading] = useState(true);
  
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const fetchFreshDetails = async () => {
      const jobId = params.jobId || params.id || params.job?.id;
      if (!jobId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const freshJob = await getJobDetail(jobId);
        if (freshJob) setJob(freshJob);
      } catch (err) {
        console.error('Error fetching fresh job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshDetails();
  }, [params.jobId, params.id]);

  if (!fontsLoaded || (loading && !job?.title)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching latest details...</Text>
      </View>
    );
  }

  // Check if current user is the employer of this job (coerce types safely)
  const _employerIdRaw = job?.employerId ?? job?.employer_id ?? job?.employer?.id ?? job?.employer;
  const currentUserId = user?.id ?? storedUserId ?? '';
  const currentRole = user?.role ?? storedRole ?? '';
  // Parenthesise: match only if IDs match OR (role is employer AND still IDs match)
  const idMatch = String(currentUserId ?? '') === String(_employerIdRaw ?? '');
  const isEmployer = idMatch || (currentRole === 'employer' && idMatch);

  // Guard: Employers must never reach AcceptJob/AcceptGig
  React.useEffect(() => {
    if (isEmployer) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.warn('[JobDetail] Employer blocked from AcceptGig route — employerId:', String(_employerIdRaw ?? ''), 'userId:', currentUserId);
    }
  }, [isEmployer, _employerIdRaw, currentUserId]);

  const handleAcceptGig = () => {
    // Double-check guard in case component state is stale
    if (isEmployer) return;
    navigation.navigate('AcceptJob', { job });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        {isEmployer ? (
          <View style={styles.managementBadge}>
            <Text style={styles.managementBadgeText}>Employer View</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="share-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topSection}>
          <View style={[styles.iconContainer, isEmployer && { backgroundColor: COLORS.secondary + '15' }]}>
            <Ionicons 
              name={isEmployer ? "stats-chart-outline" : "briefcase-outline"} 
              size={32} 
              color={isEmployer ? COLORS.secondary : COLORS.primary} 
            />
          </View>
          <Text style={styles.title}>{job.title || 'Job Detail'}</Text>
          
          {!isEmployer ? (
            <View style={styles.employerRow}>
              <View style={styles.employerInfo}>
                <Text style={styles.employerText}>
                  {job.employer_name?.business_name || job.employer?.business_name || job.employer_name || 'Employer'}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {job.employer_rating || job.employer?.avg_rating || '4.8'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: '#EAF5EF' }]}>
                <Text style={[styles.statusText, { color: COLORS.primary }]}>
                  {job.status?.toUpperCase() || 'ACTIVE'}
                </Text>
              </View>
              {job.escrow_funded && (
                <View style={[styles.statusBadge, { backgroundColor: '#FFF3EC', marginLeft: 8 }]}>
                  <Text style={[styles.statusText, { color: COLORS.secondary }]}>FUNDED</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
            <Text style={styles.badgeText}>
              {isEmployer ? 'Payment held in secure escrow' : 'Payment secured before you start'}
            </Text>
          </View>
        </View>

        {isEmployer && (
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Workers Needed</Text>
              <Text style={styles.analyticsValue}>{job.workers_needed || 1}</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Total Budget</Text>
              <Text style={styles.analyticsValue}>
                {formatCurrency((job.pay_per_worker ?? 0) * (job.workers_needed ?? 1))}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{job.location_area || job.location_city || 'Location unavailable'}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{job.duration_hours || '—'} hours</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Schedule</Text>
              <Text style={styles.infoValue}>
                {job.start_time ? new Date(job.start_time).toLocaleDateString('en-NG', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Flexible Start'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description || 'No description provided for this gig.'}</Text>
        </View>

        <View style={styles.paySection}>
          <Text style={styles.sectionTitle}>Pay Rate</Text>
          <View style={styles.payBox}>
            <Text style={styles.payAmount}>{formatCurrency(job.pay_per_worker ?? 0)}</Text>
            <Text style={styles.payUnit}>per worker</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isEmployer ? (
          <View style={styles.employerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.primary, width: '100%' }]} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('JobApplicants', { jobId: job.id || job.job_id, job })}
            >
              <Text style={styles.actionButtonText}>View Applicants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]} 
            onPress={handleAcceptGig}
            activeOpacity={0.9}
          >
            <Text style={styles.actionButtonText}>Accept Gig</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerAction: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  managementBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  managementBadgeText: {
    fontFamily: FONTS.weights.bold,
    fontSize: 11,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
    paddingBottom: 140,
  },
  topSection: {
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#EAF5EF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.weights.bold,
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 34,
    marginBottom: SPACING.sm,
  },
  employerRow: {
    marginBottom: SPACING.md,
  },
  employerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employerText: {
    fontFamily: FONTS.family,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: FONTS.weights.bold,
    fontSize: 12,
    color: '#F59E0B',
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: FONTS.weights.bold,
    fontSize: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  badgeText: {
    fontFamily: FONTS.weights.semibold,
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 8,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.xl,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  analyticsLabel: {
    fontFamily: FONTS.family,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  analyticsValue: {
    fontFamily: FONTS.weights.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  infoSection: {
    marginBottom: SPACING.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontFamily: FONTS.family,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FONTS.weights.semibold,
    fontSize: 16,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.weights.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontFamily: FONTS.family,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  paySection: {
    marginBottom: SPACING.xl,
  },
  payBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  payAmount: {
    fontFamily: FONTS.weights.bold,
    fontSize: 32,
    color: COLORS.primary,
  },
  payUnit: {
    fontFamily: FONTS.family,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  employerActions: {
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
    fontSize: 18,
  },
});
