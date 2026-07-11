import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppStore } from '../../store/useAppStore'

const SuccessScreen = () => {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const wallet = useAppStore((state) => state.wallet)
  const user = useAppStore((state) => state.user)
  const role = user?.role || 'worker'

  useEffect(() => {
    // Auto navigate after 3 seconds if user hasn't tapped
    const timer = setTimeout(() => {
      handleGoToDashboard()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleGoToDashboard = () => {
    if (role === 'worker') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    } else if (role === 'employer') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'EmployerDashboard' }],
      })
    } else if (role === 'trader') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TraderHome' }],
      })
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={COLORS.primary} />
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Wallet Created!</Text>
        <Text style={styles.subtext}>
          Your Kolliq wallet and virtual account have been activated
        </Text>

        {/* Account Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Account Name</Text>
            <Text style={styles.detailValue}>{wallet?.account_name || 'Loading...'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValueMono}>{wallet?.account_number || 'Loading...'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Bank</Text>
            <Text style={styles.detailValue}>{wallet?.bank_name || 'GTBank'}</Text>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Feather name="info" size={20} color={COLORS.primary} style={{ marginRight: 12 }} />
          <Text style={styles.infoText}>
            You can now receive payments from employers and manage your wallet
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoToDashboard}
        >
          <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.autoRedirectText}>Redirecting in 5 seconds...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
  },
  heading: {
    fontSize: 28,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  detailsCard: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 24,
  },
  detailItem: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.text,
  },
  detailValueMono: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 12,
  },
  infoBox: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.text,
    flex: 1,
    lineHeight: 19,
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
  primaryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.white,
  },
  autoRedirectText: {
    fontSize: 12,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
})

export default SuccessScreen
