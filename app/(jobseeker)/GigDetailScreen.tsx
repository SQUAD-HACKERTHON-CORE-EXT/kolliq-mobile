import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function GigDetailScreen({ navigation }: any) {
  const gig = {
    title: 'Site Labourer',
    employer: 'BuildTech Const.',
    rating: 4.9,
    hires: 24,
    pay: '5,000',
    duration: '8 hours',
    distance: '1.2 km',
    match: 70,
    description: 'We need reliable labourers for a site handover project. Duties include moving construction materials, clearing debris, and assisting the main artisans. You must come with safety boots.',
    location: 'Plot 14, Victoria Island Extension'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="share-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <Ionicons name="hammer" size={32} color={COLORS.text} />
          </View>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{gig.match}% Match</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{gig.title}</Text>
          <View style={styles.employerRow}>
            <Text style={styles.employer}>{gig.employer}</Text>
            <View style={styles.dot} />
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.ratingText}>{gig.rating} ({gig.hires} hires)</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="outline" style={styles.statCard}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{gig.duration}</Text>
          </Card>
          <Card variant="outline" style={styles.statCard}>
            <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{gig.distance}</Text>
          </Card>
          <Card variant="outline" style={styles.statCard}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.statLabel}>Pay</Text>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>₦{gig.pay}</Text>
          </Card>
        </View>

        {/* Payment Protected Banner */}
        <View style={styles.protectedBanner}>
          <View style={styles.protectedIcon}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.protectedTextContainer}>
            <Text style={styles.protectedTitle}>Payment Protected</Text>
            <Text style={styles.protectedSubtitle}>
              The employer has deposited ₦{gig.pay} into the Squad Escrow. You will be paid automatically when the job is completed.
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{gig.description}</Text>
        </View>

        {/* Location Map Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapDot} />
            </View>
            <View style={styles.mapAddress}>
              <Ionicons name="location" size={18} color={COLORS.primary} />
              <Text style={styles.mapAddressText}>{gig.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button 
          title="Not Interested" 
          onPress={() => navigation.goBack()} 
          variant="outline"
          size="lg"
          style={styles.secondaryBtn}
        />
        <Button 
          title="Accept Gig" 
          onPress={() => {}} 
          variant="primary"
          size="lg"
          style={styles.primaryBtn}
        />
      </View>
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
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 120,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  matchBadge: {
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  matchText: {
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  titleSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING['2xl'],
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  employerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  employer: {
    fontSize: 16,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  statCard: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  statValue: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  protectedBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING['2xl'],
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  protectedIcon: {
    marginRight: SPACING.md,
  },
  protectedTextContainer: {
    flex: 1,
  },
  protectedTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: '#166534',
  },
  protectedSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: '#166534',
    lineHeight: 20,
    marginTop: 4,
  },
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
  mapContainer: {
    height: 220,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceAlt,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: 'rgba(27, 77, 62, 0.2)',
  },
  mapAddress: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mapAddressText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: LAYOUT.paddingHorizontal,
    paddingBottom: SPACING['2xl'],
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryBtn: {
    flex: 1.5,
    height: 64,
  },
  secondaryBtn: {
    flex: 1,
    height: 64,
  },
});
