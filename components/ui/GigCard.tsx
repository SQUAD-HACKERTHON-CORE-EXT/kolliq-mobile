import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { Card } from './Card';

interface GigCardProps {
  title: string;
  employer: string;
  rating: number;
  pay: string;
  distance?: string;
  duration?: string;
  match?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const GigCard: React.FC<GigCardProps> = ({
  title,
  employer,
  rating,
  pay,
  match = 98,
  icon = 'briefcase-outline',
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card variant="outline" style={styles.container}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.employer}>
              {employer} • {rating}
            </Text>
          </View>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.pay}>{pay}</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{match}% Match</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  employer: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  pay: {
    fontSize: 16,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  matchBadge: {
    marginTop: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.primary,
  },
});

