import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
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

const SKILL_OPTIONS = [
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

const AVAILABILITY_OPTIONS = ['Mornings', 'Afternoons', 'Evenings', 'Full Day', 'Weekends']

const VEHICLE_OPTIONS = [
  { id: 'bike', label: 'Yes I have a motorcycle' },
  { id: 'car', label: 'Yes I have a car' },
  { id: 'none', label: 'No I do not have a vehicle' },
]

const LANGUAGE_OPTIONS = ['English', 'Yoruba', 'Hausa', 'Igbo', 'Pidgin']

const OnboardingWorkerScreen = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const isValid =
    selectedSkills.length > 0 &&
    selectedAvailability !== null &&
    selectedVehicle !== null

  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillId))
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skillId])
    }
  }

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang))
    } else {
      setSelectedLanguages([...selectedLanguages, lang])
    }
  }

  const handleContinue = () => {
    if (isValid) {
      setOnboardingData({
        skills: selectedSkills,
        availability: selectedAvailability!,
        has_vehicle: selectedVehicle !== 'none',
        vehicle_type: selectedVehicle === 'none' ? undefined : selectedVehicle,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
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
            <Text style={styles.heading}>What skills do you have?</Text>
            <Text style={styles.subtext}>Select up to 3 skills. This helps us match you with relevant jobs.</Text>

            {/* Skills Selection */}
            <View style={styles.section}>
              <View style={styles.skillsGrid}>
                {SKILL_OPTIONS.map((skill) => (
                  <TouchableOpacity
                    key={skill.id}
                    style={[
                      styles.skillChip,
                      selectedSkills.includes(skill.id) && styles.skillChipSelected,
                    ]}
                    onPress={() => toggleSkill(skill.id)}
                  >
                    {selectedSkills.includes(skill.id) && (
                      <Ionicons name="checkmark" size={16} color={COLORS.white} style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.skillChipText,
                        selectedSkills.includes(skill.id) && styles.skillChipTextSelected,
                      ]}
                    >
                      {skill.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.skillCounter}>{selectedSkills.length}/3 selected</Text>
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When are you usually available? *</Text>
              <View style={styles.optionsList}>
                {AVAILABILITY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      selectedAvailability === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedAvailability(option)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        selectedAvailability === option && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedAvailability === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vehicle */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Do you have a vehicle? *</Text>
              <View style={styles.optionsList}>
                {VEHICLE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      selectedVehicle === option.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedVehicle(option.id)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        selectedVehicle === option.id && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedVehicle === option.id && styles.optionTextSelected,
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
                      selectedLanguages.includes(lang) && styles.languageChipSelected,
                    ]}
                    onPress={() => toggleLanguage(lang)}
                  >
                    {selectedLanguages.includes(lang) && (
                      <Ionicons name="checkmark" size={14} color={COLORS.white} style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.languageChipText,
                        selectedLanguages.includes(lang) && styles.languageChipTextSelected,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillChip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  skillChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  skillChipText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  skillChipTextSelected: {
    color: COLORS.white,
  },
  skillCounter: {
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

export default OnboardingWorkerScreen
