import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { Card } from './Card';

interface ScoreCardProps {
  score: number;
  maxScore?: number;
  tier?: string;
  gigsCompleted?: number;
  ptsToNext?: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  maxScore = 100,
  tier = 'Tier 3: Loans Active',
  gigsCompleted = 12,
  ptsToNext = 15,
}) => {
  const progress = (score / maxScore) * 100;

  return (
    <Card variant="outline" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>ECONOMIC IDENTITY SCORE</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>{tier}</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.maxScore}> / {maxScore} EIS Points</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{gigsCompleted} Gigs Completed</Text>
        <Text style={[styles.footerText, { color: COLORS.secondary }]}>
          {ptsToNext} EIS Points to max tier
        </Text>
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
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontFamily: FONTS.weights.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  tierBadge: {
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  tierText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xl,
  },
  score: {
    fontSize: 56,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  maxScore: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textSecondary,
    fontFamily: FONTS.family,
  },
  progressContainer: {
    marginBottom: SPACING.xl,
  },
  progressBg: {
    height: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
});

