import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WalletLoadingScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, updateUser, setAuthenticated } = useAuthStore();
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    { text: 'Securing your identity', icon: 'shield-outline' },
    { text: 'Creating your Squad virtual account', icon: 'wallet-outline' },
    { text: 'Activating your financial profile', icon: 'bar-chart-outline' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 3000);
    const timer3 = setTimeout(() => {
      setStep(3);
      updateUser({
        walletAccountNumber: '0123456789',
        walletBankName: 'Squad Bank (GTCO)',
        economicIdentityScore: 72,
        walletBalance: 0,
      });
      setIsSuccess(true);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDashboard = () => {
    setAuthenticated(true);
    if (user?.role === 'jobseeker') {
      navigation.replace('JobseekerHome');
    } else if (user?.role === 'trader') {
      navigation.replace('TraderHome');
    } else {
      navigation.replace('EmployerHome');
    }
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.successContent} showsVerticalScrollIndicator={false}>
          <View style={styles.successHeader}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
            </View>
            <Text style={styles.successTitle}>Account Active!</Text>
            <Text style={styles.successSubtitle}>
              Your Kolliq wallet is live and ready. Your Squad account number is active. Share it with anyone to receive payments instantly.
            </Text>
          </View>

          {/* Squad Wallet Card */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletLabel}>YOUR SQUAD WALLET</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.walletMain}>
              <Text style={styles.accountNumber}>0123 456 789</Text>
              <Text style={styles.bankName}>Squad Bank (GTCO)</Text>
              <Text style={styles.poweredBy}>Powered by Squad</Text>
            </View>

            <View style={styles.walletFooter}>
              <Text style={styles.cardHolder}>{user?.firstName} {user?.lastName}</Text>
              <Ionicons name="layers" size={24} color="rgba(255,255,255,0.4)" />
            </View>
          </View>

          {/* Info Rows */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="briefcase" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.infoText}>
                {user?.role === 'employer' ? 'Post jobs and find reliable workers instantly.' :
                 user?.role === 'trader' ? 'Access micro-loans and grow your business.' :
                 'Browse jobs and gigs matching your skills.'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="credit-card" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.infoText}>Your wallet is ready to receive payments now.</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="shield" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.infoText}>
                {user?.role === 'employer' ? 'Enjoy secure escrow payments powered by Squad.' :
                 user?.role === 'trader' ? 'Transact regularly to grow your Economic Identity Score.' :
                 'Complete gigs to grow your Economic Identity Score.'}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDashboard}>
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/kolliq-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.spinnerContainer}>
          <Ionicons name="reload" size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.heading}>Setting up your Kolliq wallet</Text>

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
  successContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  walletCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 32,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  walletLabel: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.selectedBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  activeText: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  walletMain: {
    marginBottom: 32,
  },
  accountNumber: {
    fontSize: 24,
    fontFamily: FONTS.weights.bold,
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  poweredBy: {
    fontSize: 10,
    fontFamily: FONTS.weights.regular,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolder: {
    fontSize: 14,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  infoContainer: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.selectedBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
  logoImage: {
    width: 180,
    height: 80,
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
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: COLORS.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    paddingHorizontal: 8,
  },
});

export default WalletLoadingScreen;
