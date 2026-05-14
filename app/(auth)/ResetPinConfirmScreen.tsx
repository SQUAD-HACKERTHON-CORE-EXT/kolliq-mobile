import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { authService } from '../../services/auth'
import { getErrorMessage } from '../../utils/handleApiError'

const ResetPinConfirmScreen = () => {
  const route = useRoute<any>()
  const phoneFromParams = route.params?.phone || ''
  const [phone, setPhone] = useState(phoneFromParams)
  const [otp, setOtp] = useState('')
  const [newPin, setNewPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const isValid = phone.length >= 10 && otp.length === 6 && newPin.length === 4

  const handleConfirm = async () => {
    if (!isValid) {
      setError('Please fill all fields correctly')
      return
    }

    try {
      setLoading(true)
      await authService.confirmPinReset(phone, otp, newPin)
      navigation.navigate('Login')
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reset PIN'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.heading}>Confirm Reset</Text>
          <Text style={styles.subtext}>Enter the OTP sent to your phone and set a new PIN.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput value={phone} onChangeText={(v) => { setPhone(v); setError('') }} placeholder="08012345678" keyboardType="phone-pad" style={styles.input} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>OTP</Text>
            <TextInput value={otp} onChangeText={(v) => { setOtp(v); setError('') }} placeholder="6-digit code" keyboardType="number-pad" maxLength={6} style={styles.input} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New PIN</Text>
            <TextInput value={newPin} onChangeText={(v) => { setNewPin(v); setError('') }} placeholder="4-digit PIN" keyboardType="number-pad" maxLength={4} style={styles.input} secureTextEntry={true} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} disabled={!isValid || loading} onPress={handleConfirm}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Reset PIN</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.inputBorder, marginBottom: 32 },
  heading: { fontSize: 28, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 8 },
  subtext: { fontSize: 15, fontFamily: FONTS.weights.regular, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 24 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontFamily: FONTS.weights.semibold, color: COLORS.primary, marginBottom: 8, textTransform: 'uppercase' },
  input: { height: 56, borderRadius: BORDER_RADIUS.button, borderWidth: 1, borderColor: COLORS.inputBorder, backgroundColor: COLORS.inputBg, paddingHorizontal: 16, fontSize: 16, color: COLORS.text, fontFamily: FONTS.weights.regular },
  footer: { paddingHorizontal: 24 },
  button: { height: 56, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.weights.semibold },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: FONTS.weights.medium, marginTop: 8 },
})

export default ResetPinConfirmScreen
