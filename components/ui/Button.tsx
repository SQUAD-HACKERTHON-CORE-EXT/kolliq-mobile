import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<any>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    isDisabled && styles.buttonDisabled,
    fullWidth && styles.buttonFullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles} allowFontScaling={false}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.button,
    paddingHorizontal: SPACING.lg,
  },
  button_primary: {
    backgroundColor: COLORS.primary,
  },
  button_secondary: {
    backgroundColor: COLORS.accent,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  button_danger: {
    backgroundColor: COLORS.error,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  button_md: {
    height: 48,
    paddingHorizontal: SPACING.xl,
  },
  button_lg: {
    height: LAYOUT.buttonHeight,
    paddingHorizontal: SPACING['2xl'],
  },
  buttonDisabled: {
    backgroundColor: COLORS.inactive,
  },
  buttonFullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: FONTS.weights.semibold,
    textAlign: 'center',
  },
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.white,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.white,
  },
  text_ghost: {
    color: COLORS.text,
  },
  text_sm: {
    fontSize: FONTS.sizes.small,
  },
  text_md: {
    fontSize: FONTS.sizes.body,
  },
  text_lg: {
    fontSize: FONTS.sizes.body,
  },
});

