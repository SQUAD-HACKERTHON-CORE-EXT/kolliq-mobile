import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'
import { authService } from '../../services/auth'
import { getErrorMessage } from '../../utils/handleApiError'
import * as SecureStore from 'expo-secure-store'

const OnboardingReviewScreen = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const onboardingData = useAppStore((state) => state.onboardingData as any)

  const handleRegister = async () => {
    setLoading(true)
    try {
      // Build registration data for the live /api/auth/register/ endpoint
      const registrationData: any = {
        // Required fields
        phone: onboardingData.phone!,
        full_name: onboardingData.full_name!,
        email: onboardingData.email || `${onboardingData.phone}@kolliq.local`,
        date_of_birth: onboardingData.date_of_birth || '1990-01-01', // YYYY-MM-DD format
        bvn: onboardingData.bvn || '00000000000', // 11 digits (placeholder if not provided)
        pin: onboardingData.pin!,
        role: onboardingData.role!, // 'worker', 'trader', or 'employer'
      }

      // Add optional personal fields
      if (onboardingData.gender) registrationData.gender = onboardingData.gender
      if (onboardingData.location_city) registrationData.location_city = onboardingData.location_city
      if (onboardingData.location_area) registrationData.location_area = onboardingData.location_area
      if (onboardingData.address) registrationData.address = onboardingData.address
      if (onboardingData.languages && onboardingData.languages.length > 0) {
        registrationData.languages = onboardingData.languages
      }

      // Role-specific fields for workers
      if (onboardingData.role === 'worker') {
        if (onboardingData.skills && onboardingData.skills.length > 0) {
          registrationData.skills = onboardingData.skills
        }
        if (onboardingData.availability) registrationData.availability = onboardingData.availability
        if (onboardingData.has_vehicle !== undefined) {
          registrationData.has_vehicle = onboardingData.has_vehicle
          if (onboardingData.vehicle_type) registrationData.vehicle_type = onboardingData.vehicle_type
        }
      }

      // Role-specific fields for traders
      if (onboardingData.role === 'trader') {
        if (onboardingData.trade_category) registrationData.trade_category = onboardingData.trade_category
        if (onboardingData.business_name) registrationData.business_name = onboardingData.business_name
        if (onboardingData.market_name) registrationData.market_name = onboardingData.market_name
        if (onboardingData.weekly_income_range) {
          registrationData.weekly_income_range = onboardingData.weekly_income_range
        }
      }

      // Role-specific fields for employers
      if (onboardingData.role === 'employer') {
        if (onboardingData.business_name) registrationData.business_name = onboardingData.business_name
        if (onboardingData.worker_types_needed && onboardingData.worker_types_needed.length > 0) {
          registrationData.worker_types_needed = onboardingData.worker_types_needed
        }
        if (onboardingData.hiring_frequency) {
          registrationData.hiring_frequency = onboardingData.hiring_frequency
        }
        if (onboardingData.typical_pay_per_day) {
          registrationData.typical_pay_per_day = onboardingData.typical_pay_per_day
        }
        if (onboardingData.team_size) registrationData.team_size = onboardingData.team_size
      }

      const response = await authService.register(registrationData)
      
      // Extract tokens and user from response (backend may return different shapes)
      const { tokens, user } = response as any
      
      // Store user role in SecureStore for auth check
      await SecureStore.setItemAsync('role', String(user.role))
      
      // Update Zustand store
      const userData: any = {
        id: user.id,
        phone: user.phone,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      }
      
      if (user.virtual_account_number) {
        userData.virtual_account_number = user.virtual_account_number
      }
      if (user.bank_name) {
        userData.bank_name = user.bank_name
      }
      
      useAppStore.getState().setUser(userData)
      useAppStore.getState().setLoggedIn(true)
      useAppStore.getState().clearOnboardingData()
      
      navigation.navigate('SuccessScreen')
    } catch (error: any) {
      const errorMsg = getErrorMessage(error, 'An error occurred during registration')
      
      if (errorMsg.includes('phone') || errorMsg.includes('already exists')) {
        Alert.alert(
          'Account Exists',
          'An account with this phone number already exists. Please log in instead.',
          [
            {
              text: 'Login',
              onPress: () => {
                useAppStore.getState().clearOnboardingData()
                navigation.navigate('Login')
              },
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
          errorMsg,
          [{ text: 'OK', onPress: () => {} }]
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (val: any): string => {
    if (Array.isArray(val)) {
      return val.join(', ')
    }
    if (typeof val === 'boolean') {
      return val ? 'Yes' : 'No'
    }
    return String(val || '—')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 8 of 8</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.heading}>Review your information</Text>
          <Text style={styles.subtext}>Please confirm everything is correct before proceeding</Text>

          {/* Summary Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{formatValue(onboardingData.full_name)}</Text>
            </View>
            {onboardingData.gender && (
              <View style={styles.summaryItem}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{formatValue(onboardingData.gender)}</Text>
              </View>
            )}
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{formatValue(onboardingData.phone)}</Text>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>Area</Text>
              <Text style={styles.value}>{formatValue(onboardingData.location_area)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>{formatValue(onboardingData.location_city)}</Text>
            </View>
          </View>

          {/* Worker Specific */}
          {onboardingData.role === 'worker' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Details</Text>
              {onboardingData.skills && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Skills</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.skills)}</Text>
                </View>
              )}
              {onboardingData.availability && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Availability</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.availability)}</Text>
                </View>
              )}
              {onboardingData.has_vehicle !== undefined && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Has Vehicle</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.has_vehicle)}</Text>
                </View>
              )}
            </View>
          )}

          {/* Trader Specific */}
          {onboardingData.role === 'trader' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trade Details</Text>
              {onboardingData.trade_category && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Trade Categories</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.trade_category)}</Text>
                </View>
              )}
              {onboardingData.business_name && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Business Name</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.business_name)}</Text>
                </View>
              )}
              {onboardingData.market_name && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Market Name</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.market_name)}</Text>
                </View>
              )}
              {onboardingData.weekly_income_range && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Weekly Income Range</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.weekly_income_range)}</Text>
                </View>
              )}
            </View>
          )}

          {/* Employer Specific */}
          {onboardingData.role === 'employer' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Details</Text>
              {onboardingData.business_name && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Business Name</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.business_name)}</Text>
                </View>
              )}
              {onboardingData.worker_types_needed && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Worker Types Needed</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.worker_types_needed)}</Text>
                </View>
              )}
              {onboardingData.hiring_frequency && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Hiring Frequency</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.hiring_frequency)}</Text>
                </View>
              )}
              {onboardingData.typical_pay_per_day && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Pay per Day</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.typical_pay_per_day)}</Text>
                </View>
              )}
              {onboardingData.team_size && (
                <View style={styles.summaryItem}>
                  <Text style={styles.label}>Team Size</Text>
                  <Text style={styles.value}>{formatValue(onboardingData.team_size)}</Text>
                </View>
              )}
            </View>
          )}

          {/* Languages */}
          {onboardingData.languages && onboardingData.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.label}>Spoken Languages</Text>
                <Text style={styles.value}>{formatValue(onboardingData.languages)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.inactiveButton]}
          disabled={loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryButtonText}>Create My Kolliq Wallet</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          disabled={loading}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  stepText: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  inactiveButton: {
    backgroundColor: COLORS.inactive,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
  },
})

export default OnboardingReviewScreen
