import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

const WalletLoadingScreen = () => {
  const navigation = useNavigation<any>();
  const { user, updateUser, setAuthenticated } = useAuthStore();
  const [step, setStep] = useState(0);

  const steps = [
    { text: 'Securing your identity', icon: 'shield-outline', iconType: 'ionic' },
    { text: 'Creating your Squad virtual account', icon: 'wallet-outline', iconType: 'ionic' },
    { text: 'Activating your financial profile', icon: 'bar-chart-outline', iconType: 'ionic' },
  ];

  useEffect(() => {
    // Step 1: Securing identity
    const timer1 = setTimeout(() => setStep(1), 2000);
    
    // Step 2: Creating Squad account
    const timer2 = setTimeout(() => setStep(2), 4000);
    
    // Step 3: Activation and Navigation
    const timer3 = setTimeout(() => {
      setStep(3);
      // Save dummy Squad data
      updateUser({
        walletAccountNumber: '0123456789',
        walletBankName: 'Squad Bank (GTCO)',
        economicIdentityScore: 72,
        walletBalance: 0,
      });
      setAuthenticated(true);
      
      // Navigate to correct dashboard based on role
      if (user?.role === 'jobseeker') {
        navigation.replace('JobseekerHome');
      } else if (user?.role === 'trader') {
        navigation.replace('TraderHome');
      } else {
        navigation.replace('EmployerHome');
      }
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="layers" size={32} color={COLORS.white} />
          </View>
          <Text style={styles.logoText}>kolliq</Text>
        </View>

        {/* Spinner Placeholder (Simple Pulse) */}
        <View style={styles.spinnerContainer}>
          <Ionicons name="reload" size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.heading}>Setting up your Kolliq wallet</Text>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((item, index) => {
            const isCompleted = step > index;
            const isActive = step === index;
            return (
              <View key={index} style={styles.stepRow}>
                <View style={[styles.iconBox, isCompleted && styles.activeIconBox]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  ) : (
                    <Ionicons name={item.icon as any} size={18} color={isActive ? COLORS.primary : COLORS.textSecondary} />
                  )}
                </View>
                <Text style={[styles.stepText, isCompleted && styles.activeStepText]}>
                  {item.text}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  spinnerContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 48,
  },
  stepsContainer: {
    width: '100%',
    gap: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activeIconBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepText: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  activeStepText: {
    color: COLORS.primary,
    fontFamily: FONTS.weights.semibold,
  },
});

export default WalletLoadingScreen;
