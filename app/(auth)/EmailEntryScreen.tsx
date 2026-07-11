import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/auth';
import { getErrorMessage } from '../../utils/handleApiError';

const EmailEntryScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const setOnboardingData = useAppStore((state) => state.setOnboardingData);

  // Basic email validation
  const isValid = email.trim().includes('@') && email.trim().includes('.');

  const handleRequestOtp = async () => {
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      await authService.requestOtp(email.trim().toLowerCase());
      // Success - save email and navigate to OTP verification
      setOnboardingData({ email: email.trim().toLowerCase() });
      navigation.navigate('OTPVerification');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Failed to send verification code. Please try again.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.heading}>What is your email address?</Text>
            <Text style={styles.subtext}>
              We will send a 6-digit code to verify your email. This will be your primary login.
            </Text>

            {/* Input Label */}
            <Text style={styles.label}>Email Address</Text>
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color={COLORS.textSecondary} style={styles.mailIcon} />
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="example@kolliq.com"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                autoFocus
              />
            </View>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <View style={styles.shieldIcon}>
                <Feather name="shield" size={16} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.securityText}>
                Your email is kept completely secure. We use it to create your secure virtual wallet and secure your profile.
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity 
            style={[styles.primaryButton, (!isValid || loading) && styles.inactiveButton]}
            disabled={!isValid || loading}
            onPress={handleRequestOtp}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Continue with Email</Text>
                <Feather name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
              </>
            )}
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
  mailIcon: {
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.inputBorder,
    marginHorizontal: 12,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
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
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    paddingHorizontal: 8,
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

export default EmailEntryScreen;
