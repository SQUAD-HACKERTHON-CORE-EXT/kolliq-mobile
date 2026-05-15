import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Share, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, LAYOUT, FONTS } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { getJobDetail } from '../../services/jobsService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JobApplicantsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const [job, setJob] = useState<any>(params.job || null);
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    try {
      const message = `Check out this job on Kolliq: ${job?.title || 'Job Opportunity'}\nLocation: ${job?.location_area || 'Lagos'}\nPay: ${formatCurrency(job?.pay_per_worker || 0)} per worker\n\nApply here: kolliq://jobs/${job?.id}`;
      await Share.share({
        message,
        title: job?.title,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      const jobId = params.jobId || params.job?.id;
      if (!jobId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getJobDetail(jobId);
        setJob(data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [params.jobId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const applicants = job?.applicants || []; // Assume this field exists on server when count > 0

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.jobBrief}>
        <Text style={styles.jobTitle}>{job?.title || 'Job Applicants'}</Text>
        <Text style={styles.jobStats}>
          {Number(job?.workers_needed || 0)} worker{Number(job?.workers_needed) === 1 ? '' : 's'} needed • {job?.applications_count || 0} applied
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {applicants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="people-outline" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No applicants yet</Text>
            <Text style={styles.emptySubtitle}>
              Workers are still discovering your job. You can share it to get faster responses!
            </Text>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.shareButtonText}>Share Job Posting</Text>
            </TouchableOpacity>
          </View>
        ) : (
          applicants.map((applicant: any, index: number) => (
            <ApplicantCard key={applicant.id || index} applicant={applicant} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ApplicantCard = ({ applicant }: any) => (
  <TouchableOpacity style={styles.applicantCard}>
    <View style={styles.applicantInfo}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={24} color={COLORS.textSecondary} />
      </View>
      <View style={styles.applicantText}>
        <Text style={styles.applicantName}>{applicant.full_name || 'Worker Name'}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{applicant.avg_rating || '4.8'}</Text>
          <Text style={styles.matchScore}> • {applicant.match_score || 95}% match</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity style={styles.hireButton}>
      <Text style={styles.hireButtonText}>Hire</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.weights.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  jobBrief: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  jobTitle: {
    fontFamily: FONTS.weights.bold,
    fontSize: 22,
    color: COLORS.text,
  },
  jobStats: {
    fontFamily: FONTS.family,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.xl,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.weights.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontFamily: FONTS.family,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
    fontSize: 16,
  },
  applicantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicantText: {
    justifyContent: 'center',
  },
  applicantName: {
    fontFamily: FONTS.weights.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontFamily: FONTS.weights.bold,
    fontSize: 13,
    color: '#F59E0B',
    marginLeft: 4,
  },
  matchScore: {
    fontFamily: FONTS.family,
    fontSize: 13,
    color: COLORS.primary,
  },
  hireButton: {
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  hireButtonText: {
    fontFamily: FONTS.weights.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
});
