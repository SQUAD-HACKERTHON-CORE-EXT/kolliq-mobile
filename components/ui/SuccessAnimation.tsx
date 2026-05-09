import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';

interface SuccessAnimationProps {
  title: string;
  subtitle?: string;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  title, 
  subtitle,
  onComplete 
}) => {
  const scaleRef = useRef(new Animated.Value(0));
  const opacityRef = useRef(new Animated.Value(0));
  const checkmarkScaleRef = useRef(new Animated.Value(0));

  const scale = scaleRef.current;
  const opacity = opacityRef.current;
  const checkmarkScale = checkmarkScaleRef.current;

  useEffect(() => {
    // 1. Circle fades and scales in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Checkmark appears after delay
    setTimeout(() => {
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 100,
        friction: 12,
        useNativeDriver: false,
      }).start();
    }, 400);

    // 3. Callback after animation
    if (onComplete) {
      setTimeout(onComplete, 2500);
    }
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { 
        transform: [{ scale }],
        opacity,
      }]}>
        <Animated.View style={{ 
          transform: [{ scale: checkmarkScale }],
        }}>
          <Ionicons name="checkmark" size={60} color={COLORS.white} />
        </Animated.View>
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, { opacity }]}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    // Soft glow effect
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
});
