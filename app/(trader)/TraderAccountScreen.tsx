import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { formatNumber } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/auth';

const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline' as const, activeIcon: 'grid' as const },
  { id: 'TraderMarket', label: 'Market', icon: 'cart-outline' as const, activeIcon: 'cart' as const },
  { id: 'TraderIdentityTab', label: 'Identity', icon: 'finger-print-outline' as const, activeIcon: 'finger-print' as const },
  { id: 'TraderAccount', label: 'Account', icon: 'person-outline' as const, activeIcon: 'person' as const },
];

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

const MenuItem = ({ icon, label, value, onPress, danger }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconWrap, danger && styles.menuIconDanger]}>
      <Ionicons name={icon} size={20} color={danger ? '#EF4444' : COLORS.primary} />
    </View>
    <View style={styles.menuBody}>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
    </View>
    {!danger && <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
  </TouchableOpacity>
);

export default function TraderAccountScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user);
  const wallet = useAppStore((s) => s.wallet);
  const eisScore = useAppStore((s) => s.eisScore);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.business_name || user?.full_name || 'Trader';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const tradeCategories = Array.isArray(user?.trade_category)
    ? (user.trade_category as string[]).join(', ')
    : user?.trade_category || '—';

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await authService.logout();
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
          } catch {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Card variant="outline" style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.full_name || '—'}</Text>
              {user?.business_name ? (
                <Text style={styles.profileBusiness}>{user.business_name}</Text>
              ) : null}
              <Text style={styles.profilePhone}>{user?.phone || '—'}</Text>
            </View>
            <View style={styles.eisBadge}>
              <Text style={styles.eisScore}>{eisScore}</Text>
              <Text style={styles.eisLabel}>EIS</Text>
            </View>
          </View>
        </Card>

        {/* Business Info */}
        <Text style={styles.sectionLabel}>Business Details</Text>
        <Card variant="outline" style={styles.infoCard}>
          {[
            {
              label: 'Trade Category',
              value: tradeCategories,
              icon: 'storefront-outline' as const,
            },
            {
              label: 'Market Name',
              value: user?.market_name || '—',
              icon: 'location-outline' as const,
            },
            {
              label: 'City',
              value: user?.location_city || '—',
              icon: 'map-outline' as const,
            },
          ].map((item, idx, arr) => (
            <View
              key={item.label}
              style={[styles.infoRow, idx < arr.length - 1 && styles.infoRowBorder]}
            >
              <Ionicons name={item.icon} size={16} color={COLORS.textMuted} />
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Wallet Details */}
        {wallet && (
          <>
            <Text style={styles.sectionLabel}>Wallet</Text>
            <Card variant="outline" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="wallet-outline" size={16} color={COLORS.textMuted} />
                <View style={styles.infoBody}>
                  <Text style={styles.infoLabel}>Account Number</Text>
                  <Text style={styles.infoValue}>
                    {wallet.account_number || user?.squad_account_number || '—'}
                  </Text>
                </View>
              </View>
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Ionicons name="business-outline" size={16} color={COLORS.textMuted} />
                <View style={styles.infoBody}>
                  <Text style={styles.infoLabel}>Bank</Text>
                  <Text style={styles.infoValue}>
                    {wallet.bank_name || user?.squad_bank_name || '—'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color={COLORS.textMuted} />
                <View style={styles.infoBody}>
                  <Text style={styles.infoLabel}>Balance</Text>
                  <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                    ₦{formatNumber(parseFloat(wallet.balance || '0'))}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Settings */}
        <Text style={styles.sectionLabel}>Settings</Text>
        <Card variant="outline" style={styles.menuCard}>
          <MenuItem
            icon="finger-print-outline"
            label="Change PIN"
            onPress={() => navigation.navigate('ChangePin')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="trending-up-outline"
            label="EIS Score Details"
            value={`Score: ${eisScore}`}
            onPress={() => navigation.navigate('EISScoreScreen')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="save-outline"
            label="Savings"
            onPress={() => navigation.navigate('SavingsScreen')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="cash-outline"
            label="Loans"
            onPress={() => navigation.navigate('LoansScreen')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="shield-outline"
            label="Insurance"
            onPress={() => navigation.navigate('InsuranceScreen')}
          />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>Kolliq v1.0.0</Text>
      </ScrollView>

      <BottomNav
        activeTab="TraderAccount"
        onTabPress={(tab) => navigation.navigate(tab)}
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  headerTitle: { fontSize: 24, fontFamily: FONTS.weights.bold, color: COLORS.text },
  scrollContent: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingBottom: 120 },
  profileCard: { padding: SPACING.xl, marginBottom: SPACING.xl },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontFamily: FONTS.weights.bold, color: COLORS.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontFamily: FONTS.weights.bold, color: COLORS.text },
  profileBusiness: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profilePhone: { fontSize: 13, fontFamily: FONTS.family, color: COLORS.textMuted, marginTop: 2 },
  eisBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.lg,
  },
  eisScore: { fontSize: 22, fontFamily: FONTS.weights.bold, color: COLORS.primaryDark },
  eisLabel: { fontSize: 10, fontFamily: FONTS.weights.bold, color: COLORS.primaryDark },
  sectionLabel: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoCard: { padding: 0, overflow: 'hidden', marginBottom: SPACING.xl },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  infoBody: { flex: 1 },
  infoLabel: { fontSize: 12, fontFamily: FONTS.family, color: COLORS.textMuted },
  infoValue: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
    marginTop: 2,
  },
  menuCard: { padding: 0, overflow: 'hidden', marginBottom: SPACING.xl },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: 'rgba(239,68,68,0.1)' },
  menuBody: { flex: 1 },
  menuLabel: { fontSize: 15, fontFamily: FONTS.weights.medium, color: COLORS.text },
  menuLabelDanger: { color: '#EF4444' },
  menuValue: { fontSize: 12, fontFamily: FONTS.family, color: COLORS.textMuted, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg + 36 + SPACING.md },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  logoutText: { fontSize: 16, fontFamily: FONTS.weights.bold, color: '#EF4444' },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
});
