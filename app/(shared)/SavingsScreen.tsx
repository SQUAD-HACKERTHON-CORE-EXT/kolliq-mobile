import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, LAYOUT, BORDER_RADIUS } from '../../constants';
import { useAppStore } from '../../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSavings, depositSavings, withdrawSavings } from '../../services/financialService';
import { getErrorMessage } from '../../utils/handleApiError';

export default function SavingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const savings = useAppStore((state) => state.savings);
  const setSavings = useAppStore((state) => state.setSavings);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
  const [modalAmount, setModalAmount] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const data = await getSavings();
      if (data) setSavings(data);
    } catch (error) {
      console.log('Savings load error:', getErrorMessage(error, 'Failed to load savings data'));
    }
  };

  const openModal = (type: 'deposit' | 'withdraw') => {
    setModalAmount('');
    setModalError('');
    setModalType(type);
  };

  const handleModalSubmit = async () => {
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0) {
      setModalError('Please enter a valid amount');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      if (modalType === 'deposit') {
        await depositSavings(amount);
      } else {
        await withdrawSavings(amount);
      }
      setModalType(null);
      await loadSavingsData();
      Alert.alert('Success', modalType === 'deposit' ? 'Amount deposited to savings.' : 'Amount withdrawn to wallet.');
    } catch (error) {
      setModalError(getErrorMessage(error, `${modalType === 'deposit' ? 'Deposit' : 'Withdrawal'} failed`));
    } finally {
      setModalLoading(false);
    }
  };

  const data = savings;

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
          <Text style={s.balance}>₦{parseFloat(data?.balance || '0').toLocaleString()}.00</Text>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statLabel}>Interest Earned</Text>
              <Text style={s.statVal}>₦{parseFloat(data?.total_interest_earned || '0').toLocaleString()}</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statLabel}>Annual Rate</Text>
              <Text style={s.statVal}>{data?.annual_interest_rate || 0}%</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statLabel}>Wallet</Text>
              <Text style={s.statVal}>₦{parseFloat(data?.wallet_balance || '0').toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actRow}>
          <TouchableOpacity style={s.saveBtn} onPress={() => openModal('deposit')}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
            <Text style={s.saveBtnText}>Save More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.withdrawBtn} onPress={() => openModal('withdraw')}>
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
          <InfoItem icon="trending-up" text={`${data?.annual_interest_rate || 0}% annual interest on your balance`} />
          <InfoItem icon="lock-open-outline" text="Withdraw anytime to your wallet" />
          <InfoItem icon="shield-checkmark-outline" text="Savings grow your EIS score faster" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Deposit / Withdraw Modal */}
      <Modal visible={modalType !== null} transparent animationType="slide" onRequestClose={() => setModalType(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{modalType === 'deposit' ? 'Save Money' : 'Withdraw Savings'}</Text>
              <TouchableOpacity onPress={() => setModalType(null)} style={s.modalClose}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>
              {modalType === 'deposit'
                ? 'Enter amount to move from your wallet to savings.'
                : 'Enter amount to move from savings to your wallet.'}
            </Text>
            <View style={s.amountRow}>
              <Text style={s.currencySign}>₦</Text>
              <TextInput
                style={s.amountInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={modalAmount}
                onChangeText={setModalAmount}
                autoFocus
              />
            </View>
            {modalError ? <Text style={s.modalError}>{modalError}</Text> : null}
            <TouchableOpacity style={s.modalBtn} onPress={handleModalSubmit} disabled={modalLoading}>
              {modalLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={s.modalBtnText}>{modalType === 'deposit' ? 'Deposit' : 'Withdraw'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontFamily: FONTS.weights.bold, color: COLORS.text },
  modalClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  modalSub: { fontSize: 14, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary, marginBottom: 20 },
  amountRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.surfaceAlt },
  currencySign: { fontSize: 24, fontFamily: FONTS.weights.bold, color: COLORS.text, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 28, fontFamily: FONTS.weights.bold, color: COLORS.text, paddingVertical: 14 },
  modalError: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.error, marginBottom: 10 },
  modalBtn: { backgroundColor: COLORS.primary, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  modalBtnText: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.white },
});
