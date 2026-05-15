import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAppStore } from '../../store/useAppStore';
import { getBanks, verifyBankAccount } from '../../services/walletService';

export default function TransferScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const wallet = useAppStore((state) => state.wallet);

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');

  const amountNumber = Number(amount) || 0;
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('Select Bank');
  const [bankCode, setBankCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');

  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState<string | null>(null);

  const [banks, setBanks] = useState<
    Array<{ bank_code?: string; code?: string; bankCode?: string; name?: string; bank_name?: string; bankName?: string }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    const loadBanks = async () => {
      try {
        setBanksError(null);
        setBanksLoading(true);

        const banksData: any = await getBanks();
        const banks = Array.isArray(banksData?.data) ? banksData.data : Array.isArray(banksData) ? banksData : [];

        if (cancelled) return;

        if (banks.length > 0) {
          const first = banks[0];
          const nextBankCode = String(first.bank_code ?? first.code ?? first.bankCode ?? '');
          const nextBankName = String(first.name ?? first.bank_name ?? first.bankName ?? 'Bank');

          setBankCode(nextBankCode || null);
          setBankName(nextBankName);
        }
      } catch (e: any) {
        if (cancelled) return;
        const msg = e?.message ?? 'Failed to load banks';
        console.log('🏦 TransferScreen getBanks error:', msg, 'raw:', e);
        setBanksError(msg);
      } finally {
        if (!cancelled) setBanksLoading(false);
      }
    };

    loadBanks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNext = async () => {
      if (step === 1) {
      const walletBalance =
        typeof wallet?.balance === 'number'
          ? wallet.balance
          : typeof wallet?.balance === 'string'
            ? Number(wallet.balance)
            : Number(wallet?.balance ?? 0);

      console.log('💳 TransferScreen wallet balance (raw):', wallet?.balance, 'parsed:', walletBalance);

      if (!amount || Number(amount) <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount to transfer.');
        return;
      }
      if (Number(amount) > walletBalance) {
        console.log('❌ Insufficient Balance:', { amount: Number(amount), walletBalance });
        Alert.alert('Insufficient Balance', 'You do not have enough funds for this transfer.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (accountNumber.length !== 10) {
        Alert.alert('Invalid Account', 'Please enter a valid 10-digit account number.');
        return;
      }

      if (banksError) {
        Alert.alert('Banks service error', banksError);
        return;
      }

      if (!bankCode) {
        Alert.alert('Bank not ready', 'Please wait a moment for banks to load, then try again.');
        return;
      }

      try {
        setLoading(true);

        const res: any = await verifyBankAccount(bankCode, accountNumber);

        const apiName =
          res?.account_name ??
          res?.data?.account_name ??
          res?.data?.accountName ??
          res?.data?.name ??
          res?.name ??
          null;

        if (!apiName) {
          Alert.alert('Could not verify account', 'Please check the account number and try again.');
          return;
        }

        setRecipientName(String(apiName));
        setStep(3);
      } catch (e: any) {
        Alert.alert('Verification failed', e?.message ?? 'Please check the account number and try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTransfer = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
        Alert.alert(
          'Transfer Successful',
          `₦${amountNumber.toLocaleString()} has been sent to ${recipientName}`,
          [{ text: 'Great', onPress: () => navigation.navigate('WalletScreen') }]
        );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Step Indicator */}
          <View style={styles.stepIndicatorRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
            ))}
          </View>

          {step === 1 && (
            <View style={styles.stepView}>
              <Text style={styles.stepTitle}>How much would you like to send?</Text>
              <Text style={styles.balanceLabel}>Available: {formatCurrency(Number(wallet?.balance || 0))}</Text>
              
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySign}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepView}>
              <Text style={styles.stepTitle}>Enter Recipient Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0000000000"
                  keyboardType="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={styles.bankSelector}
                onPress={() => {
                  if (!banks.length) return;

                  const currentCode = bankCode ?? '';
                  const currentIndex = banks.findIndex((b) => {
                    const code = String(b.bank_code ?? b.code ?? b.bankCode ?? '');
                    return code === currentCode;
                  });

                  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % banks.length : 0;
                  const nextBank = banks[nextIndex];

                  const nextCode = String(nextBank?.bank_code ?? nextBank?.code ?? nextBank?.bankCode ?? '');
                  const nextName = String(
                    nextBank?.name ?? nextBank?.bank_name ?? nextBank?.bankName ?? 'Bank'
                  );

                  setBankCode(nextCode || null);
                  setBankName(nextName);
                }}
              >
                <Text style={styles.bankSelectorText}>{bankName}</Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepView}>
              <Text style={styles.stepTitle}>Confirm Transfer</Text>
              
              <View style={styles.confirmCard}>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Recipient</Text>
                  <Text style={styles.confirmValue}>{recipientName}</Text>
                </View>
                <View style={styles.confirmDivider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Account</Text>
                  <Text style={styles.confirmValue}>{accountNumber}</Text>
                </View>
                <View style={styles.confirmDivider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Amount</Text>
                  <Text style={styles.confirmValuePay}>₦{amountNumber.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.securityNote}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.secondary} />
                <Text style={styles.securityText}>Payment protected by Squad Escrow</Text>
              </View>
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={step === 3 ? handleTransfer : handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {step === 3 ? 'Confirm & Transfer' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: LAYOUT.paddingHorizontal, paddingVertical: SPACING.md },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontSize: 20, fontFamily: FONTS.weights.bold, color: COLORS.text },
  scrollContent: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingTop: 20 },
  stepIndicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.border },
  stepDotActive: { backgroundColor: COLORS.primary, width: 24 },
  stepView: { width: '100%' },
  stepTitle: { fontSize: 24, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  balanceLabel: { fontSize: 14, fontFamily: FONTS.family, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 32 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  currencySign: { fontSize: 40, fontFamily: FONTS.weights.bold, color: COLORS.text },
  amountInput: { fontSize: 48, fontFamily: FONTS.weights.bold, color: COLORS.primary, minWidth: 100 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontFamily: FONTS.weights.semibold, color: COLORS.textSecondary, marginBottom: 8 },
  textInput: { backgroundColor: COLORS.white, height: 56, borderRadius: 14, paddingHorizontal: 16, fontSize: 18, fontFamily: FONTS.weights.bold, borderWidth: 1, borderColor: COLORS.border },
  bankSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.white, height: 56, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border },
  bankSelectorText: { fontSize: 16, fontFamily: FONTS.weights.medium, color: COLORS.text },
  confirmCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  confirmLabel: { fontSize: 14, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary },
  confirmValue: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  confirmValuePay: { fontSize: 20, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  confirmDivider: { height: 1, backgroundColor: COLORS.border },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  securityText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: COLORS.textSecondary },
  footer: { padding: LAYOUT.paddingHorizontal, paddingBottom: 40 },
  primaryButton: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.white },
});
