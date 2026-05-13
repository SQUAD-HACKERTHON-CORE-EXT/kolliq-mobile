import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, LAYOUT } from '../../constants';
import { DUMMY_SAVINGS } from '../../constants/dummyData';

export default function SavingsScreen({ navigation }: any) {
  const data = DUMMY_SAVINGS;

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.title}>Micro-Savings</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Balance Card */}
        <View style={s.balCard}>
          <View style={s.balHeader}>
            <Text style={s.balLabel}>SAVINGS BALANCE</Text>
            <View style={s.activeBadge}>
              <View style={s.dot} />
              <Text style={s.activeText}>Active</Text>
            </View>
          </View>
          <Text style={s.balance}>₦{parseFloat(data.savings.balance).toLocaleString()}.00</Text>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statLabel}>Interest Earned</Text>
              <Text style={s.statVal}>₦{parseFloat(data.savings.total_interest_earned).toLocaleString()}</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statLabel}>Annual Rate</Text>
              <Text style={s.statVal}>{data.annual_interest_rate}%</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statLabel}>Wallet</Text>
              <Text style={s.statVal}>₦{parseFloat(data.wallet_balance).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actRow}>
          <TouchableOpacity style={s.saveBtn}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
            <Text style={s.saveBtnText}>Save More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.withdrawBtn}>
            <Ionicons name="arrow-down-circle-outline" size={20} color={COLORS.primary} />
            <Text style={s.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Auto-Save */}
        <View style={s.autoCard}>
          <View style={s.autoHeader}>
            <View style={s.autoIcon}>
              <Ionicons name="repeat-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.autoTitle}>Auto-Save Active</Text>
              <Text style={s.autoSub}>₦200 deducted daily from gig earnings</Text>
            </View>
            <View style={s.toggleOn}>
              <View style={s.toggleCircle} />
            </View>
          </View>
        </View>

        {/* How It Works */}
        <Text style={s.sectionTitle}>How Savings Work</Text>
        <View style={s.infoCard}>
          <InfoItem icon="cash-outline" text="₦200 auto-saved daily from earnings" />
          <InfoItem icon="trending-up" text={`${data.annual_interest_rate}% annual interest on your balance`} />
          <InfoItem icon="lock-open-outline" text="Withdraw anytime to your wallet" />
          <InfoItem icon="shield-checkmark-outline" text="Savings grow your EIS score faster" />
        </View>

        {/* Goal Section */}
        <Text style={s.sectionTitle}>Savings Goal</Text>
        <View style={s.goalCard}>
          <View style={s.goalHeader}>
            <Text style={s.goalTitle}>Emergency Fund</Text>
            <Text style={s.goalPct}>30%</Text>
          </View>
          <View style={s.progBg}>
            <View style={[s.progFill, { width: '30%' }]} />
          </View>
          <Text style={s.goalSub}>₦3,000 of ₦10,000 goal</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={s.infoRow}>
    <View style={s.infoIcon}><Ionicons name={icon as any} size={16} color={COLORS.primary} /></View>
    <Text style={s.infoText}>{text}</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: LAYOUT.paddingHorizontal, paddingVertical: SPACING.md },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 18, fontFamily: FONTS.weights.bold, color: COLORS.text },
  scroll: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingTop: SPACING.md },
  balCard: { backgroundColor: COLORS.primary, borderRadius: 22, padding: 24, marginBottom: SPACING.lg },
  balHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  balLabel: { fontSize: 11, fontFamily: FONTS.weights.bold, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.badgeGreen, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  activeText: { fontSize: 11, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  balance: { fontSize: 34, fontFamily: FONTS.weights.bold, color: COLORS.white, marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, fontFamily: FONTS.weights.medium, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  statVal: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.white },
  statDiv: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  actRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.xl },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, gap: 8 },
  saveBtnText: { fontSize: 14, fontFamily: FONTS.weights.bold, color: COLORS.white },
  withdrawBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: COLORS.border, gap: 8 },
  withdrawText: { fontSize: 14, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  autoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  autoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  autoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.badgeGreen, alignItems: 'center', justifyContent: 'center' },
  autoTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  autoSub: { fontSize: 12, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, marginTop: 2 },
  toggleOn: { width: 44, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 3 },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white },
  sectionTitle: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 12 },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 20, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.badgeGreen, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, fontSize: 14, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, lineHeight: 20 },
  goalCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  goalPct: { fontSize: 14, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  progBg: { height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, marginBottom: 8 },
  progFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  goalSub: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary },
});
