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
import { getErrorMessage } from '../../utils/handleApiError'

const OnboardingEmployerScreen = () => {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const onboardingData = useAppStore((state) => state.onboardingData)
  const setUser = useAppStore((state) => state.setUser)
  const setLoggedIn = useAppStore((state) => state.setLoggedIn)
  const clearOnboardingData = useAppStore((state) => state.clearOnboardingData)

  const isValid =
    fullName.trim().length > 0 &&
    businessName.trim().length > 0 &&
    locationCity.trim().length > 0 &&
    email.trim().length > 0

  const handleRegister = async () => {
    if (!isValid) return

    setLoading(true)
    try {
      const response = await register({
        phone: onboardingData.phone!,
        pin: onboardingData.pin!,
        full_name: fullName,
        role: 'employer',
        email,
        business_name: businessName,
        location_city: locationCity,
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
            <Text style={styles.heading}>Tell us about your business</Text>
            <Text style={styles.subtext}>
              This helps workers understand who they are working with
            </Text>

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={COLORS.textSecondary}
            />

            {/* Business Name */}
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="My Business Ltd"
              value={businessName}
              onChangeText={setBusinessName}
              placeholderTextColor={COLORS.textSecondary}
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
            />

            {/* Location */}
            <Text style={styles.label}>Location City</Text>
            <TextInput
              style={styles.input}
              placeholder="Lagos"
              value={locationCity}
              onChangeText={setLocationCity}
              placeholderTextColor={COLORS.textSecondary}
            />
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
  label: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.input,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
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

export default OnboardingEmployerScreen
