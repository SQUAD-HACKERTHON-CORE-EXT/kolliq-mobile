import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  borderRadius?: number;
  shadow?: boolean;
  background?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = SPACING.lg,
  borderRadius = BORDER_RADIUS.md,
  shadow = true,
  background = COLORS.white,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          borderRadius,
          backgroundColor: background,
        },
        shadow && styles.shadow,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
