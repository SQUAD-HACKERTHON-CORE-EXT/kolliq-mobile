import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PhoneEntryScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const isValid = phoneNumber.length === 11;

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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>What is your phone number?</Text>
            <Text style={styles.subtext}>
              We will send a 6 digit code to verify your number. This will be your primary login.
            </Text>

            {/* Input Label */}
            <Text style={styles.label}>Phone Number</Text>
            
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
                onChangeText={setPhoneNumber}
                autoFocus
              />
            </View>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <View style={styles.shieldIcon}>
                <Feather name="shield" size={16} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.securityText}>
                Your number is kept completely secure. We use it to create your Squad virtual account and secure your profile.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isValid && styles.inactiveButton]}
            disabled={!isValid}
            onPress={() => navigation.navigate('OTPVerification', { phoneNumber })}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.linkText} onPress={() => {}}>Terms</Text> and{' '}
            <Text style={styles.linkText} onPress={() => {}}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

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
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: 'rgba(27, 77, 62, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  shieldIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.primary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: COLORS.background,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  inactiveButton: {
    backgroundColor: COLORS.inactive,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
  },
  termsText: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: FONTS.weights.semibold,
    textDecorationLine: 'underline',
  },
});

export default PhoneEntryScreen;
