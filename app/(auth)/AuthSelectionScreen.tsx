import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// Suppress missing type declarations in some environments
// @ts-ignore: TS2307 - Cannot find module 'react-native' or its corresponding type declarations
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Button } from '../../components/ui/Button';

export default function AuthSelectionScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <View style={styles.content}>
          {/* Header Navigation */}
          <View style={styles.headerNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>What is your phone number?</Text>
            <Text style={styles.subtitle}>
              We will send a 6-digit code to verify your number. This will be your primary login.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.countrySelector}>
                <Text style={styles.countryText}>NG <Text style={styles.boldText}>+234</Text></Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="0801 234 5678"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={11}
              />
            </View>

            <View style={styles.secureNotice}>
              <View style={styles.shieldIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.secureText}>
                Your number is kept completely secure. We use it to create your Squad virtual account and secure your profile.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button 
              title="Continue" 
              onPress={() => navigation.navigate('OTPVerification', { phoneNumber })} 
              size="lg"
              fullWidth
              disabled={phoneNumber.length < 10}
              icon={<Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />}
            />
            <Text style={styles.termsText}>
              By continuing, you agree to our <Text style={styles.linkText}>Terms</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  flex1: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.lg,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepText: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium as any,
  },
  titleSection: {
    marginBottom: SPACING['2xl'],
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  inputSection: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semibold as any,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    height: 64,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.md,
  },
  countryText: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.text,
    marginRight: 4,
  },
  boldText: {
    fontFamily: FONTS.weights.bold,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.family,
    color: COLORS.text,
    letterSpacing: 1,
  },
  secureNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
  },
  shieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  secureText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  termsText: {
    marginTop: SPACING.lg,
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  linkText: {
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});

