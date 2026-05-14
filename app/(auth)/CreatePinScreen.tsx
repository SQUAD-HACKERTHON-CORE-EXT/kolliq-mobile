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
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'

const CreatePinScreen = () => {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const pinInputRef = useRef<TextInput>(null)
  const confirmPinInputRef = useRef<TextInput>(null)
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const setOnboardingData = useAppStore((state) => state.setOnboardingData)

  const pinsMatch = pin === confirmPin && pin.length === 4 && confirmPin.length === 4
  const isDisabled = !pinsMatch

  const handlePinChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value)
    }
  }

  const handleConfirmPinChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setConfirmPin(value)
    }
  }

  const handleContinue = () => {
    if (pinsMatch) {
      setOnboardingData({ pin })
      navigation.navigate('PersonalDetails')
    }
  }

  const renderPinBox = (index: number, value: string) => {
    const filled = index < value.length

    return (
      <View
        key={`box-${index}`}
        style={[
          styles.pinBox,
          filled && styles.pinBoxFilled,
        ]}
      >
        {filled && <View style={styles.pinDot} />}
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
            <Text style={styles.heading}>Create your PIN</Text>
            <Text style={styles.subtext}>
              You will use this 4-digit PIN to login and confirm transactions. Keep it safe
            </Text>

            {/* PIN Input Boxes */}
            <TouchableOpacity
              onPress={() => pinInputRef.current?.focus()}
              activeOpacity={1}
            >
              <View style={styles.pinRow}>
                {Array.from({ length: 4 }).map((_, index) =>
                  renderPinBox(index, pin)
                )}
              </View>
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

            {/* Confirm PIN Section */}
            <View style={styles.confirmPinSection}>
              <Text style={styles.confirmLabel}>Confirm your PIN</Text>
              <TouchableOpacity
                onPress={() => confirmPinInputRef.current?.focus()}
                activeOpacity={1}
              >
                <View style={styles.pinRow}>
                  {Array.from({ length: 4 }).map((_, index) =>
                    renderPinBox(index, confirmPin)
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Hidden Confirm PIN Input */}
            <TextInput
              ref={confirmPinInputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={4}
              value={confirmPin}
              onChangeText={handleConfirmPinChange}
              secureTextEntry={false}
            />

            {/* Helper text */}
            {pin.length === 4 && confirmPin.length === 4 && !pinsMatch && (
              <Text style={styles.helperText}>Both PINs must match</Text>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={[styles.primaryButton, isDisabled && styles.inactiveButton]}
            disabled={isDisabled}
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
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  pinBox: {
    width: 52,
    height: 58,
    borderRadius: 12,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  confirmPinSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  confirmLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  helperText: {
    fontSize: 11,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    marginTop: 8,
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

export default CreatePinScreen
