import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { WalletCard } from '../../components/ui/WalletCard';
import { GigCard } from '../../components/ui/GigCard';
import { DashboardHeader, BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { formatCurrency } from '../../utils/formatCurrency';

const NAV_TABS = [
  { id: 'JobseekerHome', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase-outline' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
] as const;

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader 
        userName="Chidi" 
        onNotificationPress={() => {}} 
        onProfilePress={() => {}}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScoreCard 
          score={65} 
          tier="Growing Identity"
          gigsCompleted={12}
          ptsToNext={15}
        />

        <View style={styles.section}>
          <WalletCard 
            balance={formatCurrency(24500)}
            accountNumber="1234567890"
            onAddMoney={() => {}}
            onSend={() => {}}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Your Progress" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <ProgressCard 
              title="Savings" 
              subtitle="Active (₦200/day)" 
              icon="leaf-outline" 
              iconColor="#10B981" 
              bgColor="rgba(16, 185, 129, 0.1)"
              active
            />
            <ProgressCard 
              title="Insurance" 
              subtitle="Tap to activate" 
              icon="shield-outline" 
              iconColor={COLORS.primary} 
              bgColor={COLORS.badgePurple}
            />
            <ProgressCard 
              title="Loans" 
              subtitle="Eligible at 80 pts" 
              icon="cash-outline" 
              iconColor={COLORS.textMuted} 
              bgColor={COLORS.surfaceAlt}
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Jobs Near You" 
            onViewAll={() => {}} 
          />

          <GigCard 
            title="Dispatch Rider"
            employer="FastLogistics Ltd"
            rating={4.8}
            pay={formatCurrency(4000)}
            distance="2.5 km away"
            duration="4 hours"
            icon="cube-outline"
            onPress={() => navigation.navigate('GigDetail')}
          />

          <GigCard 
            title="Event Caterer"
            employer="Mama Ngozi Foods"
            rating={4.5}
            pay={formatCurrency(6500)}
            distance="5.0 km away"
            duration="Full day"
            icon="restaurant-outline"
            onPress={() => navigation.navigate('GigDetail')}
          />
        </View>
      </ScrollView>

      <BottomNav 
        activeTab="JobseekerHome" 
        onTabPress={(tab) => navigation.navigate(tab)} 
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ProgressCard = ({ title, subtitle, icon, iconColor, bgColor, active }: any) => (
  <View style={[styles.progressCard, active && styles.progressActive]}>
    <View style={[styles.progressIcon, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <Text style={styles.progressTitle}>{title}</Text>
    <Text style={styles.progressSubtitle}>{subtitle}</Text>
  </View>
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
  section: {
    marginTop: SPACING['2xl'],
  },
  horizontalScroll: {
    marginHorizontal: -LAYOUT.paddingHorizontal,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  progressCard: {
    width: 150,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.badgePurple,
  },
  progressIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: 15,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  progressSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

