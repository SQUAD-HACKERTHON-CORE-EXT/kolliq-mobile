import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { useAppStore } from '../../store/useAppStore';
import { activateInsurance, getInsurance } from '../../services/financialService';
import { getErrorMessage } from '../../utils/handleApiError';

const PRODUCTS = [
  { id: 'income', title: 'Income Protection', desc: 'Get paid when you cannot work', icon: 'wallet-outline' as const, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', premium: '₦200/day', coverage: '₦50,000' },
  { id: 'health', title: 'Basic Health Cover', desc: 'Hospital visits and emergency care', icon: 'heart-outline' as const, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', premium: '₦150/day', coverage: '₦30,000' },
  { id: 'trade', title: 'Trade Protection', desc: 'Protect goods and tools from damage', icon: 'shield-outline' as const, color: '#A855F7', bg: 'rgba(168,85,247,0.1)', premium: '₦100/day', coverage: '₦25,000' },
];

export default function InsuranceScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [activating, setActivating] = useState(false);

  const insuranceUnlocked = useAppStore((state) => state.insuranceUnlocked);
  const insurance = useAppStore((state) => state.insurance);
  const setInsurance = useAppStore((state) => state.setInsurance);

  useEffect(() => {
    loadInsuranceData();
  }, []);

  const loadInsuranceData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      const data = await getInsurance();
      if (data) {
        setInsurance(data);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Failed to load insurance data'));
      console.log('Insurance load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      setActionError('');
      await activateInsurance();
      await loadInsuranceData();
      setSelected(null);
    } catch (error) {
      setActionError(getErrorMessage(error, 'Failed to activate insurance'));
    } finally {
      setActivating(false);
    }
  };

  const ins = insurance;

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}><Feather name="arrow-left" size={22} color={COLORS.text} /></TouchableOpacity>
        <Text style={s.title}>Micro-Insurance</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {isLoading ? (
          <View style={s.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={s.loadingText}>Loading insurance details…</Text>
          </View>
        ) : loadError ? (
          <View style={s.errorCard}>
            <Text style={s.errorText}>{loadError}</Text>
            <TouchableOpacity style={s.retryButton} onPress={loadInsuranceData}>
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={[s.banner, ins?.active ? s.bannerActive : s.bannerInactive]}>
          <Ionicons name={ins?.active ? 'shield-checkmark' : 'shield-outline'} size={22} color={ins?.active ? '#10B981' : COLORS.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[s.bannerTitle, { color: ins?.active ? '#10B981' : COLORS.accent }]}>{ins?.active ? 'Insurance Active' : 'No Active Coverage'}</Text>
            <Text style={s.bannerSub}>{ins?.active ? `₦${parseFloat(ins.premium_per_day || '0').toLocaleString()}/day` : 'Choose a plan below'}</Text>
          </View>
        </View>
        <Text style={s.section}>Available Plans</Text>
        {PRODUCTS.map((p) => (
          <TouchableOpacity key={p.id} style={[s.card, selected === p.id && s.cardSel]} onPress={() => setSelected(selected === p.id ? null : p.id)}>
            {selected === p.id && <View style={s.check}><Ionicons name="checkmark-circle" size={22} color={COLORS.primary} /></View>}
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: p.bg }]}><Ionicons name={p.icon} size={24} color={p.color} /></View>
              <View style={{ flex: 1 }}><Text style={s.cardTitle}>{p.title}</Text><Text style={s.cardDesc}>{p.desc}</Text></View>
            </View>
            <View style={s.cardFoot}>
              <View style={s.cardStat}><Text style={s.statLabel}>Premium</Text><Text style={s.statVal}>{p.premium}</Text></View>
              <View style={s.divider} />
              <View style={s.cardStat}><Text style={s.statLabel}>Coverage</Text><Text style={s.statVal}>{p.coverage}</Text></View>
            </View>
          </TouchableOpacity>
        ))}
        {selected && (
          <TouchableOpacity style={s.activateBtn} onPress={handleActivate} disabled={activating}>
            <Text style={s.activateText}>{activating ? 'Activating…' : `Activate ${PRODUCTS.find(p => p.id === selected)?.title}`}</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}
        {actionError ? <Text style={s.actionError}>{actionError}</Text> : null}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: LAYOUT.paddingHorizontal, paddingVertical: SPACING.md },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 18, fontFamily: FONTS.weights.bold, color: COLORS.text },
  scroll: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingTop: SPACING.md },
  banner: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: SPACING.xl, gap: 12 },
  bannerActive: { backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  bannerInactive: { backgroundColor: 'rgba(244,114,30,0.08)', borderWidth: 1, borderColor: 'rgba(244,114,30,0.2)' },
  bannerTitle: { fontSize: 15, fontFamily: FONTS.weights.bold },
  bannerSub: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, marginTop: 2 },
  section: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 18, padding: 20, marginBottom: 12, borderWidth: 1.5, borderColor: COLORS.border },
  cardSel: { borderColor: COLORS.primary, backgroundColor: COLORS.badgeGreen },
  check: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 4, paddingRight: 24 },
  cardDesc: { fontSize: 13, fontFamily: FONTS.weights.regular, color: COLORS.textSecondary, lineHeight: 18 },
  cardFoot: { flexDirection: 'row', backgroundColor: COLORS.surfaceAlt, borderRadius: 12, padding: 12 },
  cardStat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, marginBottom: 2 },
  statVal: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  divider: { width: 1, backgroundColor: COLORS.border },
  activateBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  activateText: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.white },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.md },
  loadingText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary },
  errorCard: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: 14, padding: 14, marginBottom: SPACING.md, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.18)' },
  errorText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: '#B91C1C' },
  retryButton: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: COLORS.primary },
  retryText: { fontSize: 12, fontFamily: FONTS.weights.bold, color: COLORS.white },
  actionError: { marginTop: 10, fontSize: 13, fontFamily: FONTS.weights.medium, color: '#B91C1C' },
});
