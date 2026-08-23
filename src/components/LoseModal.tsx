import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { useBalance } from '@/context/BalanceContext';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

const NUM_BULBS = 18;
const RING_RADIUS = 100;

export const LoseModal: React.FC = () => {
  const { loseModal, hideLoseModal } = useBalance();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loseModal.visible) {
      // 1. Entrance spring animation
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Infinite 360-degree rotation loop for marquee red lights ring
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // 3. Flashing & pulsing red bulb animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.35,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loseModal.visible]);

  if (!loseModal.visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate red bulb positions along circle perimeter
  const bulbs = Array.from({ length: NUM_BULBS }).map((_, index) => {
    const angle = (2 * Math.PI * index) / NUM_BULBS;
    const x = RING_RADIUS * Math.cos(angle);
    const y = RING_RADIUS * Math.sin(angle);
    const isLit = index % 2 === 0;
    const isSpecial = index % 3 === 0;

    return { index, x, y, isLit, isSpecial };
  });

  const displayTitle = loseModal.title || 'LOSE';

  const getDynamicFontSize = (text: string) => {
    if (text.length > 8) return 20;
    if (text.length > 5) return 26;
    if (text.length > 3) return 34;
    return 44;
  };

  const dynamicFontSize = getDynamicFontSize(displayTitle);
  const dynamicLetterSpacing = displayTitle.length > 5 ? 1 : 2.5;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={loseModal.visible}
      onRequestClose={hideLoseModal}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Header */}
          <View style={styles.headerWrap}>
            <Ionicons name="close-circle" size={22} color="#FF1744" />
            <Text style={styles.headerTitleText}>BET LOST</Text>
            <Ionicons name="close-circle" size={22} color="#FF1744" />
          </View>

          {loseModal.subtitle ? (
            <Text style={styles.subtitleText}>{loseModal.subtitle.toUpperCase()}</Text>
          ) : (
            <Text style={styles.subtitleText}>NO MATCHING SYMBOLS</Text>
          )}

          {/* Center Spinning Marquee Red Lights Ring & LOSE 3D Text */}
          <View style={styles.marqueeStage}>
            {/* Spinning Circle of Red Bulbs */}
            <Animated.View
              style={[
                styles.lightsRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              {bulbs.map((b) => (
                <Animated.View
                  key={b.index}
                  style={[
                    styles.bulb,
                    {
                      transform: [
                        { translateX: b.x },
                        { translateY: b.y },
                      ],
                      backgroundColor: b.isSpecial
                        ? '#FFFFFF'
                        : b.isLit
                        ? '#FF1744'
                        : '#FF5252',
                      opacity: b.isLit ? 1 : pulseAnim,
                    },
                    (b.isLit || b.isSpecial) && styles.bulbGlow,
                  ]}
                />
              ))}
            </Animated.View>

            {/* Inner Dark Red Circle Backdrop */}
            <View style={styles.innerCircle}>
              <View style={styles.innerRedBorder} />
              
              {/* 3D Red Text inside spinning lights ring */}
              <View style={styles.winTextWrap}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.4}
                  style={[
                    styles.winTextShadow,
                    { fontSize: dynamicFontSize, letterSpacing: dynamicLetterSpacing },
                  ]}
                >
                  {displayTitle}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.4}
                  style={[
                    styles.winTextFront,
                    { fontSize: dynamicFontSize, letterSpacing: dynamicLetterSpacing },
                  ]}
                >
                  {displayTitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Bet Lost Amount Box */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>AMOUNT DEDUCTED</Text>
            <Text style={styles.amountValue}>
              -₱{loseModal.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Try Again Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={hideLoseModal}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh-sharp" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LoseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 3, 5, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#26070B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FF1744',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.85,
    shadowRadius: 22,
    elevation: 16,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitleText: {
    color: '#FF1744',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginHorizontal: 8,
    textShadowColor: 'rgba(255, 23, 68, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleText: {
    color: '#FFB4B4',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  marqueeStage: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  lightsRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#7A0012',
  },
  bulbGlow: {
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 10,
    elevation: 8,
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#3E0A10',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FF1744',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  innerRedBorder: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 23, 68, 0.4)',
  },
  winTextWrap: {
    width: 154,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  winTextShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: '100%',
    fontWeight: '900',
    color: '#120003',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  winTextFront: {
    width: '100%',
    fontWeight: '900',
    color: '#FF4D6D',
    textAlign: 'center',
    textShadowColor: 'rgba(38, 7, 11, 0.95)',
    textShadowOffset: { width: 1.5, height: 2.5 },
    textShadowRadius: 4,
  },
  amountCard: {
    width: '100%',
    backgroundColor: 'rgba(20, 3, 6, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#66101F',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 14,
  },
  amountLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFB4B4',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF1744',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 23, 68, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    marginLeft: 8,
  },
});
