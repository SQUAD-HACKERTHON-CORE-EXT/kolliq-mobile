import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { authService } from '../../services/auth'
import { getErrorMessage } from '../../utils/handleApiError'
import { useAppStore } from '../../store/useAppStore'

const ChangePinScreen = () => {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const user = useAppStore((s) => s.user)

  const isValid = currentPin.length === 4 && newPin.length === 4

  const handleChange = async () => {
    if (!isValid) return
    try {
      setLoading(true)
      setError('')
      await authService.changePin(user?.phone || '', currentPin, newPin)
      navigation.goBack()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to change PIN'))
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

          <Text style={styles.heading}>Change PIN</Text>
          <Text style={styles.subtext}>Enter your current PIN and choose a new 4-digit PIN.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current PIN</Text>
            <TextInput value={currentPin} onChangeText={(v) => { setCurrentPin(v); setError('') }} placeholder="Current PIN" keyboardType="number-pad" maxLength={4} style={styles.input} secureTextEntry />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New PIN</Text>
            <TextInput value={newPin} onChangeText={(v) => { setNewPin(v); setError('') }} placeholder="New PIN" keyboardType="number-pad" maxLength={4} style={styles.input} secureTextEntry />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} disabled={!isValid || loading} onPress={handleChange}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Change PIN</Text>}
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

export default ChangePinScreen
