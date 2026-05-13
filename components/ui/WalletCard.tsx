import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Card } from './Card';
import { Button } from './Button';

interface WalletCardProps {
  title?: string;
  balance: string;
  score?: number;
  primaryActionTitle?: string;
  primaryActionIcon?: React.ReactNode;
  secondaryActionTitle?: string;
  secondaryActionIcon?: React.ReactNode;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  children?: React.ReactNode;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  title = 'Squad Wallet Balance',
  balance,
  score,
  primaryActionTitle = 'Add Money',
  primaryActionIcon,
  secondaryActionTitle = 'Send',
  secondaryActionIcon,
  onPrimaryAction,
  onSecondaryAction,
  children,
}) => {
  return (
    <View>
      <Card variant="outline" style={[styles.container, { backgroundColor: COLORS.primary, borderWidth: 0 }]}>
        <View style={styles.header}>
          <Text style={styles.label}>{title}</Text>
          {score !== undefined && (
            <View style={styles.scoreBadge}>
              <Ionicons name="trending-up" size={14} color={COLORS.white} />
              <Text style={styles.scoreText}>EIS Score: {score}</Text>
            </View>
          )}
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.currency}>₦</Text>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.decimal}>.00</Text>
        </View>

        <View style={styles.actions}>
          <Button 
            title={secondaryActionTitle} 
            icon={secondaryActionIcon}
            onPress={onSecondaryAction} 
            variant="outline" 
            style={styles.secondaryAction}
            textStyle={styles.secondaryActionText}
          />
          <Button 
            title={primaryActionTitle} 
            icon={primaryActionIcon}
            onPress={onPrimaryAction} 
            variant="primary" 
            style={styles.primaryAction}
            textStyle={styles.primaryActionText}
          />
        </View>
      </Card>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: FONTS.weights.medium as any,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.pill,
    gap: 4,
  },
  scoreText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.weights.bold,
  },
  dotIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xl,
  },
  currency: {
    fontSize: 32,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
  },
  balance: {
    fontSize: 40,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
  },
  decimal: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  accountNumber: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semibold as any,
    letterSpacing: 1.2,
  },
  copyButton: {
    paddingHorizontal: SPACING.md,
  },
  copyText: {
    fontSize: 11,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  secondaryAction: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0,
  },
  secondaryActionText: {
    color: COLORS.white,
  },
  primaryAction: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 0,
  },
  primaryActionText: {
    color: COLORS.primary,
  },
});

