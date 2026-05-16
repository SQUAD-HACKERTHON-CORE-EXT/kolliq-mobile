import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { getBankAccount, getBanks, getWallet, requestPayout, saveBankAccount, verifyBankAccount, normalizeNipCode } from '../../services/walletService';
import { useAppStore } from '../../store/useAppStore';

export default function RequestPayoutScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const wallet = useAppStore((state) => state.wallet);
  const setWallet = useAppStore((state) => state.setWallet);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [banks, setBanks] = useState<Array<{ bank_code?: string; code?: string; bankCode?: string; name?: string; bank_name?: string; bankName?: string }>>([]);
  const [filteredBanks, setFilteredBanks] = useState<Array<{ bank_code?: string; code?: string; bankCode?: string; name?: string; bank_name?: string; bankName?: string }>>([]);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [selectedBankName, setSelectedBankName] = useState('Select bank');
  const [accountNumberInput, setAccountNumberInput] = useState('');
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkSubmitting, setLinkSubmitting] = useState(false);
  const [savedLinkPending, setSavedLinkPending] = useState(false);
  const [nipModalVisible, setNipModalVisible] = useState(false);
  const [nipCode, setNipCode] = useState('');
  const [nipSubmitting, setNipSubmitting] = useState(false);

  const extractBanks = (payload: any) => {
    const candidate = payload?.banks ?? payload?.data ?? payload;
    return Array.isArray(candidate) ? candidate : [];
  };

  const getBankLabel = (bank: any) => String(bank?.name ?? bank?.bank_name ?? bank?.bankName ?? 'Bank');
  const getBankCodeValue = (bank: any) => String(bank?.bank_code ?? bank?.code ?? bank?.bankCode ?? '');

  const extractAccountName = (payload: any) =>
    payload?.account_name ?? payload?.data?.account_name ?? payload?.data?.accountName ?? payload?.data?.name ?? payload?.name ?? null;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [walletData, bankData, banksData] = await Promise.allSettled([getWallet(), getBankAccount(), getBanks()]);

        if (cancelled) return;

        if (walletData.status === 'fulfilled' && walletData.value) {
          setWallet(walletData.value);
        }

        if (bankData.status === 'fulfilled') {
          // getBankAccount returns either a flat bank account object
          //   { account_name, bank_name, account_number, ... }
          // or a GET-based wrapper { data: { bank_account: {...} } }
          const resolvedBank = bankData.value?.bank_account ?? bankData.value?.data ?? bankData.value ?? null;
          setBankAccount(resolvedBank);
        }

        if (banksData.status === 'fulfilled') {
          const nextBanks = extractBanks(banksData.value);
          setBanks(nextBanks);
          setFilteredBanks(nextBanks);
          if (nextBanks.length > 0) {
            const first = nextBanks[0];
            setSelectedBankCode(getBankCodeValue(first) || null);
            setSelectedBankName(getBankLabel(first));
          }
        }
      } catch (error) {
        console.log('RequestPayoutScreen load error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [setWallet]);

  useEffect(() => {
    const q = String(bankSearchQuery ?? '').trim().toLowerCase();
    if (!q) {
      setFilteredBanks(banks);
      return;
    }

    setFilteredBanks(
      banks.filter((bank) => {
        const name = getBankLabel(bank).toLowerCase();
        const code = getBankCodeValue(bank).toLowerCase();
        return name.includes(q) || code.includes(q);
      })
    );
  }, [bankSearchQuery, banks]);

  const availableBalance = useMemo(() => {
    const rawBalance = wallet?.balance ?? 0;
    return typeof rawBalance === 'string' ? Number(rawBalance) : Number(rawBalance || 0);
  }, [wallet?.balance]);

  const bankName = bankAccount?.bank_name ?? bankAccount?.bankName ?? bankAccount?.name ?? 'No bank linked';
  const accountNumber = bankAccount?.account_number ?? bankAccount?.accountNumber ?? '—';
  const accountName = bankAccount?.account_name ?? bankAccount?.accountName ?? '—';

  const resetLinkForm = () => {
    setBankSearchQuery('');
    setAccountNumberInput('');
    setLinkModalVisible(false);
  };

  const handleLinkBank = async () => {
    if (!selectedBankCode) {
      Alert.alert('Select bank', 'Choose a bank to link.');
      return;
    }

    if (accountNumberInput.length !== 10) {
      Alert.alert('Invalid account', 'Enter a valid 10-digit account number.');
      return;
    }

    try {
      setLinkSubmitting(true);
      // Call verify endpoint per API spec (bank_code + account_number only)
      const verified: any = await verifyBankAccount(selectedBankCode, accountNumberInput);
      const verifiedName = extractAccountName(verified);

      if (!verifiedName) {
        Alert.alert('Verification failed', 'Could not verify the bank account.');
        return;
      }

      const saved: any = await saveBankAccount({
        bank_code: selectedBankCode,
        account_number: accountNumberInput,
        bank_account_name: String(verifiedName),
      });

      console.log('📤 SAVE BANK RESPONSE:', JSON.stringify(saved, null, 2));

      const resolvedBank = saved?.bank_account ?? saved?.data ?? saved ?? {
        bank_code: selectedBankCode,
        account_number: accountNumberInput,
        bank_account_name: verifiedName,
        bank_name: selectedBankName,
      };

      console.log('🔁 Resolved bank object to set:', JSON.stringify(resolvedBank, null, 2));

      setBankAccount(resolvedBank);
      resetLinkForm();
      Alert.alert('Bank linked', 'Your withdrawal bank has been saved successfully.');
    } catch (error: any) {
      // If backend asks for NIP (422 with nip_code detail), prompt user once and retry
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail ?? '';
      console.log('⚠️  handleLinkBank caught error:', { status, detail });
      if (status === 422 && typeof detail === 'string' && detail.toLowerCase().includes('nip_code')) {
        // Open NIP prompt modal so user can enter last 6 digits
        setNipModalVisible(true);
        return;
      }

      const message = error?.message ?? 'Unable to link bank account.';
      Alert.alert('Link failed', message);
    } finally {
      setLinkSubmitting(false);
    }
  };

  const submitNip = async () => {
    const normalized = normalizeNipCode(nipCode);
    if (!normalized || normalized.length !== 6) {
      Alert.alert('Invalid NIP', 'Enter the 6-digit NIP provided by your bank.');
      return;
    }

    try {
      setNipSubmitting(true);
      // Retry verification with NIP included
      const verified: any = await verifyBankAccount(selectedBankCode as string, accountNumberInput, normalized);
      const verifiedName = extractAccountName(verified);

      const saved: any = await saveBankAccount({
        bank_code: selectedBankCode as string,
        account_number: accountNumberInput,
        bank_account_name: String(verifiedName),
      });

      console.log('📤 SAVE BANK RESPONSE (with NIP):', JSON.stringify(saved, null, 2));

      const resolvedBank = saved?.bank_account ?? saved?.data ?? saved ?? {
        bank_code: selectedBankCode,
        account_number: accountNumberInput,
        bank_account_name: verifiedName,
        bank_name: selectedBankName,
      };

      console.log('🔁 Resolved bank object to set (with NIP):', JSON.stringify(resolvedBank, null, 2));
      setBankAccount(resolvedBank);
      setNipModalVisible(false);
      setNipCode('');
      resetLinkForm();
      Alert.alert('Bank linked', 'Your withdrawal bank has been saved successfully.');
    } catch (error: any) {
      console.log('⚠️ submitNip error:', error?.response?.data ?? error?.message ?? error);
      const detail = error?.response?.data?.detail ?? error?.message ?? 'Unable to link bank account.';
      Alert.alert('NIP failed', String(detail));
    } finally {
      setNipSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const payoutAmount = Number(amount);

    if (!payoutAmount || payoutAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid payout amount.');
      return;
    }

    if (payoutAmount > availableBalance) {
      Alert.alert('Insufficient balance', 'The payout amount is higher than your available wallet balance.');
      return;
    }

    if (!bankAccount) {
      setLinkModalVisible(true);
      return;
    }

    try {
      setSubmitting(true);
      await requestPayout(payoutAmount, note.trim() || undefined);
      Alert.alert('Payout requested', 'Your payout request has been sent successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Request failed', error?.message ?? 'Unable to submit payout request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Payout</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>{formatCurrency(availableBalance)}</Text>
              <Text style={styles.balanceHint}>Request a payout to your linked bank account.</Text>
            </View>

            <View style={styles.bankCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="card-outline" size={18} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Withdrawal Bank</Text>
              </View>
              <Text style={styles.bankName}>{bankName}</Text>
              <Text style={styles.bankLine}>{accountName}</Text>
              <Text style={styles.bankLine}>{accountNumber}</Text>
              <TouchableOpacity style={styles.linkBankButton} onPress={() => setLinkModalVisible(true)}>
                <Text style={styles.linkBankButtonText}>{bankAccount ? 'Change Bank' : 'Link Bank for Withdrawal'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payout amount</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySign}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Add a short note for this payout request"
                placeholderTextColor={COLORS.textMuted}
                value={note}
                onChangeText={setNote}
                multiline
              />
            </View>

            <View style={styles.noticeCard}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.noticeText}>We will send the request to the backend and keep the API response visible in the terminal for debugging.</Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}> 
            <TouchableOpacity style={[styles.submitButton, submitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitText}>Submit Payout Request</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal visible={linkModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>Link Withdrawal Bank</Text>
            <Text style={styles.modalSubtitle}>Pick a bank and enter your 10-digit account number.</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search bank by name or code"
              placeholderTextColor={COLORS.textMuted}
              value={bankSearchQuery}
              onChangeText={setBankSearchQuery}
            />

            <View style={styles.selectedBankBox}>
              <Text style={styles.selectedBankLabel}>Selected bank</Text>
              <Text style={styles.selectedBankValue}>{selectedBankName}</Text>
            </View>

            <TextInput
              style={styles.accountInput}
              placeholder="Account number"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              maxLength={10}
              value={accountNumberInput}
              onChangeText={setAccountNumberInput}
            />

            <View style={styles.bankListContainer}>
              <FlatList
                data={filteredBanks}
                keyExtractor={(item, index) => String(getBankCodeValue(item) || index)}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const name = getBankLabel(item);
                  const code = getBankCodeValue(item);
                  return (
                    <TouchableOpacity
                      style={styles.bankRow}
                      onPress={() => {
                        setSelectedBankCode(code || null);
                        setSelectedBankName(name);
                      }}
                    >
                      <Text style={styles.bankRowName}>{name}</Text>
                      {selectedBankCode === code ? <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} /> : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  resetLinkForm();
                  setLinkModalVisible(false);
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryActionButton} onPress={() => handleLinkBank()} disabled={linkSubmitting}>
                {linkSubmitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryActionButtonText}>Verify & Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={nipModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>Enter Bank NIP</Text>
            <Text style={styles.modalSubtitle}>Your bank requires a 6-digit NIP to verify this account. Enter it below.</Text>

            <TextInput
              style={styles.accountInput}
              placeholder="6-digit NIP"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              value={nipCode}
              onChangeText={setNipCode}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setNipModalVisible(false);
                  setNipCode('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryActionButton} onPress={() => submitNip()} disabled={nipSubmitting}>
                {nipSubmitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryActionButtonText}>Submit NIP</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
  },
  balanceValue: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: FONTS.weights.bold,
    marginTop: 6,
  },
  balanceHint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: FONTS.family,
    marginTop: 6,
  },
  bankCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  bankName: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  bankLine: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  linkBankButton: {
    marginTop: 12,
    height: 44,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkBankButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 60,
  },
  currencySign: {
    fontSize: 24,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 110,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: FONTS.family,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EAF5EF',
    borderRadius: 14,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    fontFamily: FONTS.family,
  },
  footer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
  },
  submitButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalPanel: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 12,
    fontFamily: FONTS.family,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    marginBottom: 12,
  },
  selectedBankBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
  },
  selectedBankLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontFamily: FONTS.weights.semibold,
  },
  selectedBankValue: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.weights.bold,
  },
  accountInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    marginBottom: 12,
  },
  bankListContainer: {
    maxHeight: 220,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  bankRow: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bankRowName: {
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONTS.weights.medium,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONTS.weights.semibold,
  },
  primaryActionButton: {
    flex: 1,
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: FONTS.weights.bold,
  },
  nipInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
});