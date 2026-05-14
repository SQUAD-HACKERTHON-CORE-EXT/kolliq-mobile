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

const TRADE_CATEGORY_OPTIONS = [
  { id: 'food', label: 'Food and Groceries' },
  { id: 'clothing', label: 'Clothing and Fabric' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'household', label: 'Household Goods' },
  { id: 'hair_beauty', label: 'Hair and Beauty' },
  { id: 'phone_repair', label: 'Phone Repairs' },
  { id: 'artisan', label: 'Artisan Services' },
  { id: 'farming', label: 'Farming Produce' },
  { id: 'other', label: 'Other' },
]

const WEEKLY_INCOME_OPTIONS = [
  { id: 'under_5000', label: 'Under 5,000 naira' },
  { id: '5000-20000', label: '5,000 to 20,000 naira' },
  { id: '20000-50000', label: '20,000 to 50,000 naira' },
  { id: 'above_50000', label: 'Above 50,000 naira' },
]

const OnboardingTraderDetailsScreen = () => {
  const [tradeCategories, setTradeCategories] = useState<string[]>([])
  const [businessName, setBusinessName] = useState('')
  const [marketName, setMarketName] = useState('')
  const [weeklyIncome, setWeeklyIncome] = useState<string | null>(null)

  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const isValid =
    tradeCategories.length > 0 && weeklyIncome !== null

  const toggleCategory = (categoryId: string) => {
    if (tradeCategories.includes(categoryId)) {
      setTradeCategories(tradeCategories.filter((c) => c !== categoryId))
    } else if (tradeCategories.length < 3) {
      setTradeCategories([...tradeCategories, categoryId])
    }
  }

  const handleContinue = () => {
    if (isValid) {
      setOnboardingData({
        trade_category: tradeCategories,
        business_name: businessName || undefined,
        market_name: marketName || undefined,
        weekly_income_range: weeklyIncome!,
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
            <Text style={styles.stepText}>Step 7 of 8</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Tell us about your trade</Text>
            <Text style={styles.subtext}>
              This helps us personalize financial products for your business
            </Text>

            {/* Trade Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What do you trade? * (Up to 3)</Text>
              <View style={styles.categoriesGrid}>
                {TRADE_CATEGORY_OPTIONS.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      tradeCategories.includes(cat.id) &&
                        styles.categoryChipSelected,
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    {tradeCategories.includes(cat.id) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.categoryChipText,
                        tradeCategories.includes(cat.id) &&
                          styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.counter}>{tradeCategories.length}/3 selected</Text>
            </View>

            {/* Business Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Business or Trade Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Amina Fresh Provisions"
                placeholderTextColor={COLORS.textSecondary}
                value={businessName}
                onChangeText={setBusinessName}
              />
              <Text style={styles.hint}>What you call your business or stall</Text>
            </View>

            {/* Market Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Market Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Kano Central Market"
                placeholderTextColor={COLORS.textSecondary}
                value={marketName}
                onChangeText={setMarketName}
              />
              <Text style={styles.hint}>The specific market you operate in</Text>
            </View>

            {/* Weekly Income Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Income Range *</Text>
              <View style={styles.optionsList}>
                {WEEKLY_INCOME_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      weeklyIncome === option.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setWeeklyIncome(option.id)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        weeklyIncome === option.id && styles.radioButtonSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        weeklyIncome === option.id && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },
  counter: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
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

export default OnboardingTraderDetailsScreen
