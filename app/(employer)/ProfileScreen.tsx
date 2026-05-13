import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { Card } from '../../components/ui/Card';

const NAV_TABS = [
  { id: 'EmployerHome', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
  { id: 'workers', label: 'Workers', icon: 'people-outline' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export default function EmployerProfile({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View style={styles.onlineDot} />
          <View style={styles.avatarPlaceholderSmall} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Employer Profile</Text>
        <Text style={styles.title}>Alhaji Musa Stores</Text>

        {/* Rating Card */}
        <Card variant="elevated" style={styles.ratingCard}>
          <View style={styles.ratingIconContainer}>
            <View style={styles.ratingIcon}>
              <Ionicons name="star" size={32} color={COLORS.warning} />
            </View>
          </View>
          <Text style={styles.ratingValue}>4.8</Text>
          <Text style={styles.ratingLabel}>Average Business Rating</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Total Hires</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Escrow Rate</Text>
            </View>
          </View>
        </Card>

        {/* Trust Factors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why workers trust you</Text>
          
          <View style={styles.trustItem}>
            <View style={[styles.trustIcon, { backgroundColor: COLORS.secondaryMuted }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.trustText}>
              <Text style={styles.trustTitle}>Consistent Escrow Deposits</Text>
              <Text style={styles.trustSubtitle}>
                You always deposit gig payments into the Squad escrow before work begins. Workers feel safe.
              </Text>
            </View>
          </View>

          <View style={styles.trustItem}>
            <View style={[styles.trustIcon, { backgroundColor: COLORS.badgeGreen }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.trustText}>
              <Text style={styles.trustTitle}>Prompt Job Confirmation</Text>
              <Text style={styles.trustSubtitle}>
                You confirm job completion quickly, releasing payments to workers without delay.
              </Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews from Workers</Text>
          
          <ReviewCard 
            role="Site Labourer" 
            rating={5} 
            text="Very straightforward employer. Deposited the money early and confirmed immediately when we finished loading." 
          />

          <ReviewCard 
            role="Delivery Rider" 
            rating={4} 
            text="Good job, packages were ready when I arrived. Will work for them again." 
          />
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="profile" 
        onTabPress={(tab) => navigation.navigate(tab === 'profile' ? 'Profile' : tab)} 
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
});

