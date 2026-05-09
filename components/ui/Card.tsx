import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { COLORS, BORDER_RADIUS, LAYOUT } from '../../constants';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  borderRadius?: number;
  variant?: 'elevated' | 'outline' | 'flat';
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 16,
  borderRadius = BORDER_RADIUS.card,
  variant = 'elevated',
  background = COLORS.surface,
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
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
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
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
});

