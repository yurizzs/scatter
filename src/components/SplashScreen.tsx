import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse glow animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slow subtle rotation for background ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Main entrance sequence
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto transition to main app after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background radial atmosphere & decorative elements */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowAnim,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Original SCATTER Casino Badge Logo */}
        <View style={styles.logoBadge}>
          <View style={styles.innerBadge}>
            <Ionicons name="sparkles" size={44} color={CasinoColors.goldPrimary} />
          </View>
          <View style={styles.scatterStarsTop}>
            <Ionicons name="star" size={14} color={CasinoColors.goldLight} />
            <Ionicons name="diamond" size={16} color={CasinoColors.goldPrimary} style={{ marginHorizontal: 12 }} />
            <Ionicons name="star" size={14} color={CasinoColors.goldLight} />
          </View>
        </View>

        <Text style={styles.brandTitle}>Skatter07</Text>
        <View style={styles.goldLineContainer}>
          <View style={styles.goldLine} />
          <Ionicons name="diamond" size={10} color={CasinoColors.goldPrimary} style={{ marginHorizontal: 6 }} />
          <View style={styles.goldLine} />
        </View>
        <Text style={styles.subTitle}>LUXURY SLOTS & SPINS</Text>

        <View style={styles.protoBadge}>
          <Text style={styles.protoBadgeText}>PROTOTYPE EDITION</Text>
        </View>
      </Animated.View>

      {/* Skip button for quick testing */}
      <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
        <Text style={styles.skipText}>TAP TO ENTER</Text>
        <Ionicons name="chevron-forward" size={14} color={CasinoColors.goldPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CasinoColors.bgDarkest,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glowRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: CasinoColors.borderGold,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 3,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    marginBottom: 24,
  },
  innerBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scatterStarsTop: {
    position: 'absolute',
    top: -12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  goldLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  goldLine: {
    width: 60,
    height: 1.5,
    backgroundColor: CasinoColors.goldSecondary,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: CasinoColors.textSecondary,
    letterSpacing: 3,
    marginBottom: 28,
  },
  protoBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: CasinoColors.borderGold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  protoBadgeText: {
    color: CasinoColors.goldLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 56, 42, 0.8)',
    borderWidth: 1,
    borderColor: CasinoColors.borderGold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  skipText: {
    color: CasinoColors.goldPrimary,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    marginRight: 6,
  },
});
