import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'
import { register } from '../../services/authService'
import { handleApiError, getErrorMessage } from '../../utils/handleApiError'

const OnboardingTraderScreen = () => {
  const [fullName, setFullName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [marketName, setMarketName] = useState('')
  const [tradeCategory, setTradeCategory] = useState('')
  const [weeklyIncomeRange, setWeeklyIncomeRange] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const onboardingData = useAppStore((state) => state.onboardingData)
  const setUser = useAppStore((state) => state.setUser)
  const setLoggedIn = useAppStore((state) => state.setLoggedIn)
  const clearOnboardingData = useAppStore((state) => state.clearOnboardingData)

  const isValid = fullName.trim().length > 0 && locationCity.trim().length > 0

  const handleRegister = async () => {
    if (!isValid) return

    setLoading(true)
    try {
      const response = await register({
        phone: onboardingData.phone!,
        pin: onboardingData.pin!,
        full_name: fullName,
        role: 'trader',
        location_city: locationCity,
        market_name: marketName || undefined,
        trade_category: tradeCategory || undefined,
        weekly_income_range: weeklyIncomeRange || undefined,
      })

      const { user } = response
      setUser(user)
      setLoggedIn(true)
      clearOnboardingData()
      navigation.navigate('WalletLoading')
    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert(
          'Account Exists',
          'An account with this phone number already exists. Please log in instead.',
          [
            {
              text: 'Login',
              onPress: () => navigation.navigate('Login'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        )
      } else {
        Alert.alert(
          'Registration Failed',
          getErrorMessage(error),
          [
            { text: 'Retry', onPress: () => {} },
            { text: 'Cancel', style: 'cancel' },
          ]
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Set up your trading profile</Text>
            <Text style={styles.subtext}>
              Tell us about your business so we can customize your experience
            </Text>

            {/* Full Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Chidi Okonkwo"
                placeholderTextColor={COLORS.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Location City */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>City / Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Lagos"
                placeholderTextColor={COLORS.textSecondary}
                value={locationCity}
                onChangeText={setLocationCity}
              />
            </View>

            {/* Market Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Market Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Lekki Shopping Mall, Shoprite"
                placeholderTextColor={COLORS.textSecondary}
                value={marketName}
                onChangeText={setMarketName}
              />
              <Text style={styles.hint}>Where do you sell or conduct business?</Text>
            </View>

            {/* Trade Category */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>What do you trade? (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Clothing, Electronics, Food, Services"
                placeholderTextColor={COLORS.textSecondary}
                value={tradeCategory}
                onChangeText={setTradeCategory}
              />
              <Text style={styles.hint}>Type of goods or services</Text>
            </View>

            {/* Weekly Income Range */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weekly Income Range (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., ₦10,000 - ₦50,000"
                placeholderTextColor={COLORS.textSecondary}
                value={weeklyIncomeRange}
                onChangeText={setWeeklyIncomeRange}
              />
              <Text style={styles.hint}>Helps us personalize financial products</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={[styles.primaryButton, !isValid && styles.inactiveButton]}
            disabled={!isValid || loading}
            onPress={handleRegister}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Create My Kolliq Wallet</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  hint: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.button,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  inactiveButton: {
    backgroundColor: COLORS.inactive,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
  },
})

export default OnboardingTraderScreen
