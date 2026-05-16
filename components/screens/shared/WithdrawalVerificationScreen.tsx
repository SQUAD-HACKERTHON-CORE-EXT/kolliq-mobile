import React, { useEffect } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../../constants'
import { useAppStore } from '../../../store/useAppStore'

const steps = [
  {
    title: 'Add your withdrawal bank',
    text: 'Link the bank account where you want withdrawals to go.',
    icon: 'credit-card',
  },
  {
    title: 'Verify the account name',
    text: 'The name on the account must match the verified bank record.',
    icon: 'check-circle',
  },
  {
    title: 'Save the verified account',
    text: 'Once the bank is verified, save it to your wallet profile.',
    icon: 'save',
  },
  {
    title: 'Return to withdrawal',
    text: 'After verification, you can unlock the withdrawal flow immediately.',
    icon: 'arrow-right-circle',
  },
]

export default function WithdrawalVerificationScreen({ navigation }: any) {
  const savedBankAccount = useAppStore((state) => state.savedBankAccount)
  const fetchSavedBankAccount = useAppStore((state) => state.fetchSavedBankAccount)

  const hasBankAccount = Boolean(savedBankAccount?.has_bank_account)
  const isVerified = savedBankAccount?.bank_account_verified === true

  useEffect(() => {
    fetchSavedBankAccount()
  }, [fetchSavedBankAccount])

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedBankAccount()
    }, [fetchSavedBankAccount])
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Required</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark-outline" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.heroTitle}>Your withdrawal account must be verified first</Text>
          <Text style={styles.heroText}>
            This keeps payouts secure and helps us make sure the money goes to the right bank account.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Bank linked</Text>
            <Text style={[styles.statusValue, hasBankAccount ? styles.statusGood : styles.statusMuted]}>
              {hasBankAccount ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Verification status</Text>
            <Text style={[styles.statusValue, isVerified ? styles.statusGood : styles.statusPending]}>
              {isVerified ? 'Verified' : 'Not verified'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Steps to verification</Text>
        <View style={styles.stepsList}>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepIndexBox}>
                <Text style={styles.stepIndex}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Ionicons name={step.icon as any} size={18} color={COLORS.primary} />
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>What to do now</Text>
          <Text style={styles.noteText}>
            If your account is already linked, open the bank screen and complete verification.
            If no bank is linked, add one first.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddBankAccountScreen')}
        >
          <Text style={styles.primaryButtonText}>{hasBankAccount ? 'Verify Bank Account' : 'Add Bank Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('WithdrawalScreen')}
        >
          <Text style={styles.secondaryButtonText}>Back to Withdrawal</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
    paddingBottom: SPACING['3xl'],
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  statusCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
  },
  statusGood: {
    color: COLORS.primary,
  },
  statusPending: {
    color: '#B45309',
  },
  statusMuted: {
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  stepIndexBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepIndex: {
    fontSize: 13,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    flexShrink: 1,
  },
  stepText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noteCard: {
    marginTop: SPACING.xl,
    backgroundColor: '#F7F8F4',
    borderRadius: BORDER_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E8DE',
  },
  noteTitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  primaryButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
  secondaryButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONTS.weights.bold,
  },
})