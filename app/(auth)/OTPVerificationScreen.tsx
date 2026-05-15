import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'
import { authService } from '../../services/auth'
import { getErrorMessage } from '../../utils/handleApiError'

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const otpInputRef = useRef<TextInput>(null)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const phone = useAppStore((state) => state.onboardingData.phone)
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const isComplete = otp.length === 6
  const isDisabled = !isComplete || loading

  const handleOtpChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
      setError('')
    }
  }

  const handleVerifyOtp = async () => {
    if (!isComplete || !phone) return

    setLoading(true)
    setError('')

    try {
      await authService.verifyOtp(phone, otp)
      // Success - navigate to PIN creation
      navigation.navigate('CreatePin')
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to verify OTP')
      setError(errorMessage)
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const renderOtpBox = (index: number, value: string) => {
    const filled = index < value.length

    return (
      <View
        key={`box-${index}`}
        style={[
          styles.otpBox,
          filled && styles.otpBoxFilled,
          error && styles.otpBoxError,
        ]}
      >
        {filled && <View style={styles.otpDot} />}
      </View>
    )
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
            <Text style={styles.heading}>Enter verification code</Text>
            <Text style={styles.subtext}>
              We sent a 6-digit code to {phone}. Enter it below.
            </Text>

            {/* OTP Input Boxes */}
            <TouchableOpacity
              onPress={() => otpInputRef.current?.focus()}
              activeOpacity={1}
            >
              <View style={styles.otpRow}>
                {Array.from({ length: 6 }).map((_, index) =>
                  renderOtpBox(index, otp)
                )}
              </View>
            </TouchableOpacity>

            {/* Hidden OTP Input */}
            <TextInput
              ref={otpInputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={handleOtpChange}
              secureTextEntry={false}
              editable={!loading}
            />

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Helper text */}
            <Text style={styles.helperText}>
              Didn't receive a code?{' '}
              <Text
                style={[
                  styles.helperText,
                  { color: COLORS.primary, fontFamily: FONTS.weights.semibold },
                ]}
              >
                Resend
              </Text>
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={[styles.primaryButton, isDisabled && styles.inactiveButton]}
            disabled={isDisabled}
            onPress={handleVerifyOtp}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
  },
  otpBox: {
    width: 52,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selectedBg,
  },
  otpBoxError: {
    borderColor: COLORS.error,
  },
  otpDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
  },
  helperText: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
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
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
})

export default OTPVerificationScreen
