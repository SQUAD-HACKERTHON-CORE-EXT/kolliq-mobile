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
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'

const WORKER_TYPES_OPTIONS = [
  { id: 'delivery', label: 'Delivery and Dispatch' },
  { id: 'cooking', label: 'Cooking and Catering' },
  { id: 'market_assistant', label: 'Market Assistant' },
  { id: 'labor', label: 'Labor and Construction' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'security', label: 'Security' },
  { id: 'teaching', label: 'Teaching and Tutoring' },
  { id: 'phone_repair', label: 'Phone Repairs' },
  { id: 'driving', label: 'Driving' },
  { id: 'farming', label: 'Farming' },
  { id: 'warehousing', label: 'Warehousing' },
  { id: 'event_catering', label: 'Event Catering' },
  { id: 'other', label: 'Other' },
]

const HIRING_FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Occasionally']

const PAY_RANGE_OPTIONS = [
  { id: 'under_3000', label: 'Under 3,000 naira' },
  { id: '3000-5000', label: '3,000 to 5,000 naira' },
  { id: '5000-10000', label: '5,000 to 10,000 naira' },
  { id: 'above_10000', label: 'Above 10,000 naira' },
]

const TEAM_SIZE_OPTIONS = [
  { id: '1-2', label: '1 to 2 workers' },
  { id: '3-5', label: '3 to 5 workers' },
  { id: '6-10', label: '6 to 10 workers' },
  { id: 'above_10', label: 'More than 10 workers' },
]

const LANGUAGE_OPTIONS = ['English', 'Yoruba', 'Hausa', 'Igbo', 'Pidgin']

const OnboardingEmployerDetailsScreen = () => {
  const [businessName, setBusinessName] = useState('')
  const [workerTypes, setWorkerTypes] = useState<string[]>([])
  const [hiringFrequency, setHiringFrequency] = useState<string | null>(null)
  const [payRange, setPayRange] = useState<string | null>(null)
  const [teamSize, setTeamSize] = useState<string | null>(null)
  const [languages, setLanguages] = useState<string[]>([])

  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const isValid =
    businessName.trim().length > 0 &&
    workerTypes.length > 0 &&
    hiringFrequency !== null &&
    payRange !== null &&
    teamSize !== null

  const toggleWorkerType = (typeId: string) => {
    if (workerTypes.includes(typeId)) {
      setWorkerTypes(workerTypes.filter((w) => w !== typeId))
    } else if (workerTypes.length < 5) {
      setWorkerTypes([...workerTypes, typeId])
    }
  }

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang))
    } else {
      setLanguages([...languages, lang])
    }
  }

  const handleContinue = () => {
    if (isValid) {
      setOnboardingData({
        business_name: businessName,
        worker_types_needed: workerTypes,
        hiring_frequency: hiringFrequency!,
        typical_pay_per_day: payRange!,
        team_size: teamSize!,
        languages: languages.length > 0 ? languages : undefined,
      })
      navigation.navigate('OnboardingLocation')
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
            <Text style={styles.stepText}>Step 5 of 8</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Tell us about your business</Text>
            <Text style={styles.subtext}>
              This helps us personalize your experience
            </Text>

            {/* Business Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Business Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., FastLogistics Ltd"
                placeholderTextColor={COLORS.textSecondary}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            {/* Worker Types Needed */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Worker Types Needed * (Up to 5)</Text>
              <View style={styles.typesGrid}>
                {WORKER_TYPES_OPTIONS.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeChip,
                      workerTypes.includes(type.id) && styles.typeChipSelected,
                    ]}
                    onPress={() => toggleWorkerType(type.id)}
                  >
                    {workerTypes.includes(type.id) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.typeChipText,
                        workerTypes.includes(type.id) && styles.typeChipTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.counter}>{workerTypes.length}/5 selected</Text>
            </View>

            {/* Hiring Frequency */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How often do you hire? *</Text>
              <View style={styles.optionsList}>
                {HIRING_FREQUENCY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      hiringFrequency === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => setHiringFrequency(option)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        hiringFrequency === option && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        hiringFrequency === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pay Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Typical pay per day *</Text>
              <View style={styles.optionsList}>
                {PAY_RANGE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      payRange === option.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setPayRange(option.id)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        payRange === option.id && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        payRange === option.id && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Team Size */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Typical team size *</Text>
              <View style={styles.optionsList}>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      teamSize === option.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setTeamSize(option.id)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        teamSize === option.id && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        teamSize === option.id && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Languages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages spoken (Optional)</Text>
              <View style={styles.languagesGrid}>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.languageChip,
                      languages.includes(lang) && styles.languageChipSelected,
                    ]}
                    onPress={() => toggleLanguage(lang)}
                  >
                    {languages.includes(lang) && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={COLORS.white}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.languageChipText,
                        languages.includes(lang) && styles.languageChipTextSelected,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={[styles.primaryButton, !isValid && styles.inactiveButton]}
            disabled={!isValid}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
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
  formGroup: {
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 12,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  typeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeChipText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  typeChipTextSelected: {
    color: COLORS.white,
  },
  counter: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: COLORS.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
    flex: 1,
  },
  optionTextSelected: {
    fontFamily: FONTS.weights.semibold,
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  languageChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  languageChipText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  languageChipTextSelected: {
    color: COLORS.white,
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

export default OnboardingEmployerDetailsScreen
