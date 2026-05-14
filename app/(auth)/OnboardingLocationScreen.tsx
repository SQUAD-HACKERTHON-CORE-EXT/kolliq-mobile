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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'

const NIGERIAN_CITIES = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Kaduna',
  'Katsina',
  'Rivers',
  'Oyo',
  'Enugu',
  'Kwara',
  'Osun',
  'Ondo',
  'Ekiti',
  'Ogun',
  'Bauchi',
  'Plateau',
  'Nasarawa',
  'Taraba',
  'Adamawa',
  'Borno',
  'Yobe',
  'Kebbi',
  'Sokoto',
  'Zamfara',
  'Jigawa',
  'Bayelsa',
  'Akwa Ibom',
  'Cross River',
  'Imo',
  'Abia',
  'Ebonyi',
  'Delta',
  'Edo',
  'Lagos Island',
]

const OnboardingLocationScreen = () => {
  const [locationArea, setLocationArea] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const isValid = locationArea.trim().length > 0 && selectedCity !== null

  const filteredCities = NIGERIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  )

  const handleContinue = () => {
    if (isValid) {
      setOnboardingData({
        location_area: locationArea,
        location_city: selectedCity!,
      })
      navigation.navigate('OnboardingReview')
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
            <Text style={styles.stepText}>
              Step 6 of 8
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Where are you located?</Text>
            <Text style={styles.subtext}>
              This helps us match you with nearby opportunities
            </Text>

            {/* Location Area */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {role === 'employer' ? 'Business Location Area' : 'Location Area'} *
              </Text>
              <TextInput
                style={styles.input}
                placeholder={role === 'employer' ? 'e.g., Ikeja' : 'e.g., Surulere, Lekki'}
                placeholderTextColor={COLORS.textSecondary}
                value={locationArea}
                onChangeText={setLocationArea}
              />
              <Text style={styles.hint}>Your neighbourhood or area</Text>
            </View>

            {/* Location City */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location City *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCityDropdown(!showCityDropdown)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !selectedCity && { color: COLORS.textSecondary },
                  ]}
                >
                  {selectedCity || 'Select your city'}
                </Text>
                <MaterialCommunityIcons
                  name={showCityDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              {/* Dropdown */}
              {showCityDropdown && (
                <View style={styles.dropdown}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search cities..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={citySearch}
                    onChangeText={setCitySearch}
                  />
                  <ScrollView style={styles.citiesList} nestedScrollEnabled>
                    {filteredCities.map((city) => (
                      <TouchableOpacity
                        key={city}
                        style={[
                          styles.cityOption,
                          selectedCity === city && styles.cityOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedCity(city)
                          setShowCityDropdown(false)
                          setCitySearch('')
                        }}
                      >
                        <Text
                          style={[
                            styles.cityOptionText,
                            selectedCity === city &&
                              styles.cityOptionTextSelected,
                          ]}
                        >
                          {city}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
  },
  hint: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
  },
  citiesList: {
    maxHeight: 250,
  },
  cityOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  cityOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  cityOptionText: {
    fontSize: 14,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
  },
  cityOptionTextSelected: {
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
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

export default OnboardingLocationScreen
