import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Card } from './Card';
import { Button } from './Button';

interface WalletCardProps {
  balance: string;
  accountNumber: string;
  onAddMoney: () => void;
  onSend: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  accountNumber,
  onAddMoney,
  onSend,
}) => {
  return (
    <Card variant="outline" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Squad Wallet Balance</Text>
        <View style={styles.dotIndicator} />
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.balance}>{balance}</Text>
        <Text style={styles.decimal}>.00</Text>
      </View>

      <View style={styles.accountContainer}>
        <Text style={styles.accountNumber}>{accountNumber}</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Text style={styles.copyText}>COPY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <Button 
          title="Send" 
          onPress={onSend} 
          variant="outline" 
          style={styles.actionButton}
        />
        <Button 
          title="Add Money" 
          onPress={onAddMoney} 
          variant="primary" 
          style={[styles.actionButton, styles.blackButton]}
        />
      </View>
    </Card>
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
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium as any,
  },
  dotIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceAlt,
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
    color: COLORS.text,
  },
  balance: {
    fontSize: 40,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  decimal: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  accountNumber: {
    fontSize: 16,
    color: COLORS.text,
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
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    height: 48,
  },
  blackButton: {
    backgroundColor: '#000000',
  },
});

