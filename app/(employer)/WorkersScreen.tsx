import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Card } from '../../components/ui/Card';
import { BottomNav } from '../../components/ui/DashboardLayout';

const NAV_TABS = [
  { id: 'EmployerDashboard', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
  { id: 'Workers', label: 'Workers', icon: 'people-outline', activeIcon: 'people' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'EmployerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

const WORKERS_LIST = [
  { id: '1', name: 'Chidi Okonkwo', role: 'Delivery', rating: 4.8, eisScore: 450, status: 'Available' },
  { id: '2', name: 'Ngozi Eze', role: 'Cleaning', rating: 4.5, eisScore: 320, status: 'On a job' },
  { id: '3', name: 'Samuel Yabo', role: 'Security', rating: 4.9, eisScore: 510, status: 'Available' },
  { id: '4', name: 'Fatima Bello', role: 'Catering', rating: 4.7, eisScore: 410, status: 'Available' },
];

export default function WorkersScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'My Team' | 'Browse'>('My Team');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workers Directory</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="filter-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or skill..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'My Team' && styles.activeTab]}
          onPress={() => setActiveTab('My Team')}
        >
          <Text style={[styles.tabText, activeTab === 'My Team' && styles.activeTabText]}>My Team (12)</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Browse' && styles.activeTab]}
          onPress={() => setActiveTab('Browse')}
        >
          <Text style={[styles.tabText, activeTab === 'Browse' && styles.activeTabText]}>Browse Kolliq</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {WORKERS_LIST.map(worker => (
          <Card key={worker.id} variant="outline" style={styles.workerCard}>
            <View style={styles.workerTop}>
              <View style={styles.workerInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{worker.name.charAt(0)}</Text>
                </View>
                <View style={styles.workerMeta}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerRole}>{worker.role} • <Ionicons name="star" size={12} color="#F59E0B" /> {worker.rating}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, worker.status === 'Available' ? styles.statusAvailable : styles.statusBusy]}>
                <Text style={[styles.statusText, worker.status === 'Available' ? styles.statusTextAvailable : styles.statusTextBusy]}>
                  {worker.status}
                </Text>
              </View>
            </View>
            <View style={styles.workerDivider} />
            <View style={styles.workerBottom}>
              <Text style={styles.eisScore}>EIS Score: <Text style={styles.eisScoreValue}>{worker.eisScore}</Text></Text>
              <TouchableOpacity style={styles.hireButton}>
                <Text style={styles.hireButtonText}>Hire Now</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav 
        activeTab="workers" 
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: LAYOUT.paddingHorizontal,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.weights.medium,
    fontSize: 14,
    color: COLORS.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: LAYOUT.paddingHorizontal,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: FONTS.weights.semibold,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  workerCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  workerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarInitial: {
    fontFamily: FONTS.weights.bold,
    fontSize: 18,
    color: COLORS.primary,
  },
  workerMeta: {
    justifyContent: 'center',
  },
  workerName: {
    fontFamily: FONTS.weights.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  workerRole: {
    fontFamily: FONTS.weights.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusAvailable: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusBusy: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statusText: {
    fontFamily: FONTS.weights.semibold,
    fontSize: 11,
  },
  statusTextAvailable: {
    color: '#10B981',
  },
  statusTextBusy: {
    color: '#F59E0B',
  },
  workerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  workerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eisScore: {
    fontFamily: FONTS.weights.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  eisScoreValue: {
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  hireButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  hireButtonText: {
    fontFamily: FONTS.weights.semibold,
    fontSize: 13,
    color: COLORS.white,
  },
});
