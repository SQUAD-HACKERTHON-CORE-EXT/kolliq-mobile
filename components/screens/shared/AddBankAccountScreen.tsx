import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
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
import { getBanks, saveBankAccount, verifyBankAccount } from '../../../services/walletService'
import { handleApiError, getErrorMessage } from '../../../utils/handleApiError'
import { useAppStore } from '../../../store/useAppStore'

const BANKS_LOADING_TEXT = 'Loading banks...'

export default function AddBankAccountScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const setSavedBankAccount = useAppStore((state) => state.setSavedBankAccount)

  const [banks, setBanks] = useState<any[]>([])
  const [loadingBanks, setLoadingBanks] = useState(true)
  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [saveError, setSaveError] = useState('')

  const bankCode = useMemo(
    () => String(selectedBank?.bank_code ?? selectedBank?.code ?? selectedBank?.bankCode ?? ''),
    [selectedBank]
  )

  const bankName = useMemo(
    () => String(selectedBank?.name ?? selectedBank?.bank_name ?? selectedBank?.bankName ?? 'Select bank'),
    [selectedBank]
  )

  const loadBanks = async () => {
    try {
      setLoadingBanks(true)
      const data = await getBanks()
      setBanks(Array.isArray(data) ? data : [])
    } catch (error: any) {
      handleApiError(error, 'Failed to load banks.')
    } finally {
      setLoadingBanks(false)
    }
  }

  useEffect(() => {
    loadBanks()
  }, [])

  const handleVerify = async () => {
    if (!bankCode) {
      setVerifyError('Please select a bank.')
      return
    }

    if (accountNumber.length !== 10) {
      setVerifyError('Enter a valid 10-digit account number.')
      return
    }

    try {
      setVerifyError('')
      setSaveError('')
      setVerifying(true)
      const response: any = await verifyBankAccount(bankCode, accountNumber)
      const accountName =
        response?.account_name ??
        response?.data?.account_name ??
        response?.data?.name ??
        response?.name ??
        response?.accountName ??
        ''

      if (!accountName) {
        setVerifyError('Could not verify account name.')
        setVerified(false)
        return
      }

      setVerifiedAccountName(String(accountName))
      setVerified(true)
    } catch (error: any) {
      const message = getErrorMessage(error, 'Verification failed.')
      setVerified(false)
      setVerifyError(message)
    } finally {
      setVerifying(false)
    }
  }

  const handleSave = async () => {
    if (!verified || !verifiedAccountName) return

    try {
      setSaving(true)
      setSaveError('')
      const saved: any = await saveBankAccount({
        bank_code: bankCode,
        account_number: accountNumber,
        bank_account_name: verifiedAccountName,
      })
      const resolved = saved?.bank_account ?? saved?.data ?? saved ?? null
      setSavedBankAccount(resolved)
      Alert.alert('Success', 'Bank account saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error: any) {
      const message = getErrorMessage(error, 'Failed to save bank account.')
      setSaveError(message)
      handleApiError(error, 'Failed to save bank account.')
    } finally {
      setSaving(false)
    }
  }

  const bankButtonDisabled = loadingBanks || !banks.length

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Bank Account</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.selectField} onPress={() => setPickerVisible(true)} disabled={bankButtonDisabled}>
          <View style={styles.selectRow}>
            <Text style={selectedBank ? styles.selectText : styles.placeholderText}>{bankName}</Text>
            {loadingBanks ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Feather name="chevron-down" size={18} color={COLORS.textSecondary} />}
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 10-digit account number"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          value={accountNumber}
          onChangeText={(text) => {
            setAccountNumber(text.replace(/\D/g, ''))
            setVerified(false)
            setVerifyError('')
            setSaveError('')
          }}
        />

        <TouchableOpacity
          style={[styles.primaryButton, (!bankCode || accountNumber.length < 10 || verifying) && styles.primaryButtonDisabled]}
          onPress={handleVerify}
          disabled={!bankCode || accountNumber.length < 10 || verifying}
        >
          {verifying ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryButtonText}>Verify Account</Text>}
        </TouchableOpacity>
        {verifyError ? <Text style={styles.errorText}>{verifyError}</Text> : null}

        {verified ? (
          <View style={styles.confirmCard}>
            <View style={styles.confirmHeader}>
              <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
              <Text style={styles.confirmTitle}>Account Verified</Text>
            </View>
            <Text style={styles.accountName}>{verifiedAccountName}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>Save This Account</Text>}
            </TouchableOpacity>
            {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            <ScrollView style={{ maxHeight: 340 }}>
              {banks.map((bank) => {
                const code = String(bank?.bank_code ?? bank?.code ?? bank?.bankCode ?? '')
                const name = String(bank?.name ?? bank?.bank_name ?? bank?.bankName ?? 'Bank')
                const isActive = code === bankCode
                return (
                  <TouchableOpacity
                    key={code || name}
                    style={[styles.bankRow, isActive && styles.bankRowActive]}
                    onPress={() => {
                      setSelectedBank(bank)
                      setPickerVisible(false)
                      setVerified(false)
                      setVerifyError('')
                      setSaveError('')
                    }}
                  >
                    <Text style={styles.bankRowText}>{name}</Text>
                    {isActive ? <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} /> : null}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPickerVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    fontSize: 26,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  selectField: {
    height: 54,
    borderRadius: BORDER_RADIUS.card,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: SPACING.lg,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
  },
  placeholderText: {
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: BORDER_RADIUS.card,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    height: 54,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#B0B0A8',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    marginTop: 10,
  },
  confirmCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.card,
    padding: 16,
    marginTop: SPACING.lg,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
  },
  accountName: {
    fontSize: 17,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  bankRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankRowActive: {
    backgroundColor: 'rgba(27, 77, 62, 0.06)',
  },
  bankRowText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
    flex: 1,
    paddingRight: 12,
  },
  closeButton: {
    marginTop: 14,
    height: 48,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
  },
})
