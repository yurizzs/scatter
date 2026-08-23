import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { useBalance } from '@/context/BalanceContext';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

const NUM_BULBS = 18;
const RING_RADIUS = 100;

export const WinModal: React.FC = () => {
  const { winModal, hideWinModal } = useBalance();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (winModal.visible) {
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

      // 2. Infinite 360-degree rotation loop for marquee lights ring
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // 3. Flashing & pulsing bulb animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [winModal.visible]);

  if (!winModal.visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate bulb positions along circle perimeter
  const bulbs = Array.from({ length: NUM_BULBS }).map((_, index) => {
    const angle = (2 * Math.PI * index) / NUM_BULBS;
    const x = RING_RADIUS * Math.cos(angle);
    const y = RING_RADIUS * Math.sin(angle);
    const isLit = index % 2 === 0;
    const isSpecial = index % 3 === 0;

    return { index, x, y, isLit, isSpecial };
  });

  const displayTitle = winModal.title || 'WIN';

  const getDynamicFontSize = (text: string) => {
    if (text.length > 8) return 20;
    if (text.length > 5) return 26; // "JACKPOT" (7 chars) -> font size 26
    if (text.length > 3) return 34; // 4-5 chars -> font size 34
    return 44; // "WIN" (3 chars) -> font size 44
  };

  const dynamicFontSize = getDynamicFontSize(displayTitle);
  const dynamicLetterSpacing = displayTitle.length > 5 ? 1 : 2.5;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={winModal.visible}
      onRequestClose={hideWinModal}
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
          {/* Top Celebration Header */}
          <View style={styles.headerWrap}>
            <Ionicons name="sparkles" size={18} color={CasinoColors.goldPrimary} />
            <Text style={styles.congratulationsText}>CONGRATULATIONS!</Text>
            <Ionicons name="sparkles" size={18} color={CasinoColors.goldPrimary} />
          </View>

          {winModal.subtitle ? (
            <Text style={styles.subtitleText}>{winModal.subtitle.toUpperCase()}</Text>
          ) : null}

          {/* Center Spinning Marquee Lights Ring & WIN 3D Text */}
          <View style={styles.marqueeStage}>
            {/* Spinning Circle of Bulbs */}
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
                      backgroundColor: b.isSpecial ? '#FFFFFF' : b.isLit ? '#FFF200' : '#FFB700',
                      opacity: b.isLit ? 1 : pulseAnim,
                    },
                    (b.isLit || b.isSpecial) && styles.bulbGlow,
                  ]}
                />
              ))}
            </Animated.View>

            {/* Inner Dark Emerald Circle Backdrop */}
            <View style={styles.innerCircle}>
              <View style={styles.innerGoldBorder} />
              
              {/* 3D Gold Text inside lights ring */}
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

          {/* Winnings Amount Box */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>YOU WON</Text>
            <Text style={styles.amountValue}>
              +₱{winModal.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Collect Winner Button */}
          <TouchableOpacity
            style={styles.collectBtn}
            onPress={hideWinModal}
            activeOpacity={0.85}
          >
            <Ionicons name="trophy" size={18} color={CasinoColors.bgDarkest} />
            <Text style={styles.collectBtnText}>COLLECT NOW</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WinModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 20, 14, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#08291B',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: CasinoColors.goldPrimary,
    padding: 24,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 15,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  congratulationsText: {
    color: CasinoColors.goldPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginHorizontal: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitleText: {
    color: CasinoColors.textSecondary,
    fontSize: 12,
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
    borderColor: '#7A5B00',
  },
  bulbGlow: {
    shadowColor: '#FFF200',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#093624',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 3,
    borderColor: CasinoColors.goldPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  innerGoldBorder: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
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
    color: '#201300',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  winTextFront: {
    width: '100%',
    fontWeight: '900',
    color: '#FFE259',
    textAlign: 'center',
    textShadowColor: 'rgba(40, 24, 0, 0.95)',
    textShadowOffset: { width: 1.5, height: 2.5 },
    textShadowRadius: 4,
  },
  amountCard: {
    width: '100%',
    backgroundColor: 'rgba(5, 22, 16, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 14,
  },
  amountLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '900',
    color: CasinoColors.emeraldAccent,
    letterSpacing: 1,
    textShadowColor: 'rgba(16, 185, 129, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  collectBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  collectBtnText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    marginLeft: 8,
  },
});
