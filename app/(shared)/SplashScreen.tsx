import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const opacityRef = useRef(new Animated.Value(0));
  const scaleRef = useRef(new Animated.Value(0.8));
  const textOpacityRef = useRef(new Animated.Value(0));
  const textTranslateYRef = useRef(new Animated.Value(20));

  const opacity = opacityRef.current;
  const scale = scaleRef.current;
  const textOpacity = textOpacityRef.current;
  const textTranslateY = textTranslateYRef.current;

  useEffect(() => {
    // Sequence: 
    // 1. Fade in the icon/background
    // 2. Scale up the icon
    // 3. Fade in the Kolliq text
    // 4. Wait and then complete

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    // Text fade in after delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
    }, 600);

    // Final exit animation and callback
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }).start(() => {
        onAnimationComplete();
      });
    }, 2500);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { 
        opacity,
        transform: [{ scale }],
      }]}>
        {/* Kolliq Icon Placeholder */}
        <View style={styles.iconBox} />
        
        <Animated.View style={[styles.textContainer, { 
          opacity: textOpacity,
          transform: [{ translateY: textTranslateY }],
        }]}>
          <Text style={styles.title}>Kolliq</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FINANCIAL IDENTITY</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: 24,
    // Add a soft shadow for that "premium" feel
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    letterSpacing: -2,
  },
  badge: {
    marginTop: 8,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
});
