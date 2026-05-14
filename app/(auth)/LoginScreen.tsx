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
  Alert,
  Image,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'
import { authService } from '../../services/auth'
import { getErrorMessage } from '../../utils/handleApiError'

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pinInputRef = useRef<TextInput>(null)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const isPhoneValid = phoneNumber.length === 10 || phoneNumber.length === 11
  const isPinValid = pin.length === 4
  const isValid = isPhoneValid && isPinValid

  const handlePinChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value)
      setError('')
    }
  }

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhoneNumber(value)
      setError('')
    }
  }

  const handleLogin = async () => {
    if (!isValid) {
      setError(
        !isPhoneValid 
          ? 'Phone number must be 10-11 digits' 
          : 'PIN must be 4 digits'
      )
      return
    }

    setLoading(true)
    setError('')
    try {
      console.log('🔐 Login attempt with:', { phone: phoneNumber, pinLength: pin.length })
      const response = await authService.login(phoneNumber, pin)
      console.log('✅ Login response:', response)

      useAppStore.getState().setUser({
        id: response.id,
        phone: response.phone,
        full_name: response.full_name,
        role: response.role,
        squad_account_number: response.squad_account_number,
        squad_bank_name: response.squad_bank_name,
        walletAccountNumber: response.squad_account_number,
        walletBankName: response.squad_bank_name,
        eis_score: 0,
      })
      useAppStore.getState().setLoggedIn(true)

      // Navigate to correct dashboard based on role
      console.log('🗺️ Navigating based on role:', response.role)
      if (response.role === 'worker') {
        console.log('→ Going to Home')
        try {
          navigation.navigate('Home')
          console.log('✅ Navigation to Home successful')
        } catch (navError) {
          console.error('❌ Navigation error:', navError)
        }
      } else if (response.role === 'employer') {
        console.log('→ Going to EmployerDashboard')
        try {
          navigation.navigate('EmployerDashboard')
          console.log('✅ Navigation to EmployerDashboard successful')
        } catch (navError) {
          console.error('❌ Navigation error:', navError)
        }
      } else if (response.role === 'trader') {
        console.log('→ Going to TraderHome')
        try {
          navigation.navigate('TraderHome')
          console.log('✅ Navigation to TraderHome successful')
        } catch (navError) {
          console.error('❌ Navigation error:', navError)
        }
      } else {
        console.warn('⚠️ Unknown role:', response.role)
        setError('Unknown user role returned from server')
      }
    } catch (error: any) {
      console.error('❌ Login error:', error)
      const errorMessage = getErrorMessage(error, 'An error occurred during login')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const renderPinBox = (index: number) => {
    const filled = index < pin.length

    return (
      <View
        key={`pin-box-${index}`}
        style={[
          styles.pinBox,
          filled && styles.pinBoxFilled,
        ]}
      >
        {filled && !showPin && <View style={styles.pinDot} />}
        {filled && showPin && (
          <Text style={styles.pinDigit}>{pin[index]}</Text>
        )}
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
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../../assets/kolliq-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subtext}>
              Enter your phone number and PIN to continue
            </Text>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View style={styles.prefixContainer}>
                <Text style={styles.flagEmoji}>🇳🇬</Text>
                <Text style={styles.prefixText}>NG +234</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="0801 234 5678"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                maxLength={11}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
              />
            </View>

            {/* PIN Input */}
            <View style={styles.pinSection}>
              <Text style={styles.label}>PIN</Text>
              <TouchableOpacity
                onPress={() => pinInputRef.current?.focus()}
                activeOpacity={1}
                style={styles.pinInputWrapper}
              >
                <View style={styles.pinRow}>
                  {Array.from({ length: 4 }).map((_, index) =>
                    renderPinBox(index)
                  )}
                </View>
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPin(!showPin)}
                >
                  <Feather
                    name={showPin ? 'eye-off' : 'eye'}
                    size={18}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Hidden PIN Input */}
              <TextInput
                ref={pinInputRef}
                style={styles.hiddenInput}
                keyboardType="number-pad"
                maxLength={4}
                value={pin}
                onChangeText={handlePinChange}
                secureTextEntry={false}
              />
            </View>

            {/* Forgot PIN Link */}
            <TouchableOpacity onPress={() => navigation.navigate('ResetPinRequest')}>
              <Text style={styles.forgotPinText}>Forgot PIN?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={[styles.primaryButton, !isValid && styles.inactiveButton]}
            disabled={!isValid || loading}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 32,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  logoImage: {
    width: 160,
    height: 70,
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
  label: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.input,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  prefixText: {
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.inputBorder,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.weights.medium,
  },
  pinSection: {
    marginBottom: 16,
  },
  pinInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.input,
    height: 70,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  pinBox: {
    width: 48,
    height: 54,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selectedBg,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  pinDigit: {
    fontSize: 18,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
  },
  showButton: {
    padding: 8,
    marginLeft: 8,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  forgotPinText: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: '#D32F2F',
    flex: 1,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
  },
})

export default LoginScreen
