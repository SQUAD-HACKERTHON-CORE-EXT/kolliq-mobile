import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../../constants'
import { formatCurrency } from '../../../utils/formatCurrency'
import { getErrorMessage, handleApiError } from '../../../utils/handleApiError'
import { useAppStore } from '../../../store/useAppStore'

const MIN_WITHDRAWAL = 2500

const maskAccountNumber = (value?: string) => {
  if (!value) return '—'
  const text = String(value)
  if (text.length <= 4) return text
  return `****${text.slice(-4)}`
}

const statusColor = (status?: string) => {
  const normalized = String(status ?? '').toUpperCase()
  if (normalized === 'PROCESSING') return '#2563EB'
  if (normalized === 'COMPLETED') return '#16A34A'
  return '#F4721E'
}

export default function WithdrawalScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const wallet = useAppStore((state) => state.wallet)
  const savedBankAccount = useAppStore((state) => state.savedBankAccount)
  const withdrawalHistory = useAppStore((state) => state.withdrawalHistory)
  const withdrawalLoading = useAppStore((state) => state.withdrawalLoading)

  const fetchSavedBankAccount = useAppStore((state) => state.fetchSavedBankAccount)
  const fetchWithdrawalHistory = useAppStore((state) => state.fetchWithdrawalHistory)
  const requestWithdrawal = useAppStore((state) => state.requestWithdrawal)

  const walletBalance = useMemo(() => Number(wallet?.balance ?? 0), [wallet?.balance])
  const enteredAmount = useMemo(() => Number(String(amount || '0').replace(/\D/g, '')), [amount])
  const bankAccount = savedBankAccount
  const hasBankAccount = Boolean(bankAccount?.has_bank_account)
  const isBankVerified = bankAccount?.bank_account_verified === true

  const load = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchSavedBankAccount(), fetchWithdrawalHistory()])
    } catch (error: any) {
      handleApiError(error, 'Failed to load withdrawal data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleWithdraw = () => {
    setError('')
    if (!hasBankAccount) {
      navigation.navigate('AddBankAccountScreen')
      return
    }
    if (!isBankVerified) {
      navigation.navigate('WithdrawalVerification')
      return
    }
    if (enteredAmount < MIN_WITHDRAWAL || enteredAmount > walletBalance) {
      return
    }
    setConfirmVisible(true)
  }

  const handleConfirmWithdraw = async () => {
    try {
      setSubmitting(true)
      setError('')
      await requestWithdrawal({
        amount: enteredAmount,
        bank_code: String(bankAccount?.bank_code ?? ''),
        account_number: String(bankAccount?.bank_account_number ?? ''),
      })
      setConfirmVisible(false)
      setSuccess(true)
    } catch (error: any) {
      const status = error?.response?.status
      const rawMessage = getErrorMessage(error, 'Withdrawal request failed.')
      if (String(rawMessage).toLowerCase().includes('insufficient balance')) {
        setError(`Insufficient balance. Your available balance is ${formatCurrency(walletBalance)}.`)
      } else if (status === 422) {
        setError('Withdrawal request failed. Please check your details and try again.')
      } else if (status >= 500) {
        setError('Something went wrong on our end. Please try again in a few minutes.')
      } else {
        setError(rawMessage)
      }
      handleApiError(error, rawMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const historyList = Array.isArray(withdrawalHistory) ? withdrawalHistory : []

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.loadingWrap, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.successWrap, { paddingTop: insets.top + 40 }]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.successTitle}>Withdrawal Requested</Text>
          <Text style={styles.successText}>
            Your withdrawal of {formatCurrency(enteredAmount)} is being processed. You will be notified when it is complete.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={async () => {
              await load()
              navigation.navigate('WalletScreen')
            }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Bank Account</Text>
          </View>
          {hasBankAccount ? (
            <>
              <Text style={styles.bankLine}>{bankAccount?.bank_name ?? 'Bank'}</Text>
              <Text style={styles.bankLine}>{maskAccountNumber(bankAccount?.bank_account_number)}</Text>
              <Text style={styles.bankLine}>{bankAccount?.bank_account_name ?? 'Account name'}</Text>
              <TouchableOpacity style={styles.changeButton} onPress={() => navigation.navigate('AddBankAccountScreen')}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
              {!isBankVerified ? (
                <Text style={styles.verificationWarning}>Account has to be verified before withdrawal.</Text>
              ) : null}
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>No bank account saved yet</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddBankAccountScreen')}>
                <Text style={styles.primaryButtonText}>Add Bank Account</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {hasBankAccount ? (
          <View style={styles.card}>
            <Text style={styles.amountLabel}>Withdrawal Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/\D/g, ''))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <Text style={styles.helperText}>Minimum withdrawal is ₦2,500</Text>
            <Text style={styles.balanceText}>Available balance: {formatCurrency(walletBalance)}</Text>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (enteredAmount < MIN_WITHDRAWAL || enteredAmount > walletBalance || !isBankVerified) && styles.primaryButtonDisabled,
              ]}
              onPress={handleWithdraw}
              disabled={enteredAmount < MIN_WITHDRAWAL || enteredAmount > walletBalance || !isBankVerified}
            >
              <Text style={styles.primaryButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Withdrawal History</Text>
          {withdrawalLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : historyList.length ? (
            historyList.map((item, index) => {
              const status = String(item?.status ?? 'PENDING').toUpperCase()
              const completed = status === 'COMPLETED'
              return (
                <View key={String(item?.id ?? index)} style={styles.historyRow}>
                  <View>
                    <Text style={[styles.historyAmount, { color: completed ? COLORS.primary : COLORS.textSecondary }]}>
                      {formatCurrency(Number(item?.amount ?? 0))}
                    </Text>
                    <Text style={styles.historyDate}>{String(item?.created_at ?? item?.date ?? '')}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor(status) }]}>
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                </View>
              )
            })
          ) : (
            <Text style={styles.emptyHistory}>No withdrawals yet</Text>
          )}
        </View>
      </ScrollView>

      <Modal visible={confirmVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Amount</Text>
              <Text style={styles.modalValue}>{formatCurrency(enteredAmount)}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>To</Text>
              <Text style={styles.modalValue}>{bankAccount?.bank_account_name ?? 'Account'} • {bankAccount?.bank_name ?? ''}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Status</Text>
              <Text style={styles.modalMuted}>Will be processed within 24 hours</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmWithdraw} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryButtonText}>Confirm Withdraw</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButton} onPress={() => setConfirmVisible(false)}>
              <Text style={styles.ghostButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(error)} transparent animationType="fade">
        <View style={styles.errorOverlay}>
          <View style={styles.errorSheet}>
            <Text style={styles.errorSheetText}>{error}</Text>
            <TouchableOpacity style={styles.ghostButton} onPress={() => setError('')}>
              <Text style={styles.ghostButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: SPACING.md,
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
  content: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  bankLine: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  verificationWarning: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.error,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: '#B0B0A8',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
  changeButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: FONTS.weights.bold,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.card,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    height: 56,
  },
  currency: {
    fontSize: 18,
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
  helperText: {
    fontSize: 11,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  balanceText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyAmount: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
  },
  emptyHistory: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  modalValue: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    flexShrink: 1,
    textAlign: 'right',
  },
  modalMuted: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    textAlign: 'right',
    flexShrink: 1,
  },
  ghostButton: {
    height: 48,
    borderRadius: BORDER_RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  ghostButtonText: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 10,
  },
  successText: {
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  doneButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
  errorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorSheet: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    padding: 18,
  },
  errorSheetText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: '#B91C1C',
    marginBottom: 12,
  },
})
