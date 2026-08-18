import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { SlotSymbol, SLOT_SYMBOLS } from '@/constants/SlotData';
import { CasinoColors } from '@/constants/CasinoTheme';

interface SlotReelProps {
  reelIndex: number;
  isSpinning: boolean;
  targetSymbol: SlotSymbol;
  stopDelayMs: number;
  isHighlighted?: boolean;
  onStop: () => void;
}

const SYMBOL_HEIGHT = 64;
const VISIBLE_HEIGHT = SYMBOL_HEIGHT * 3; // 3 rows visible per reel

export const SlotReel: React.FC<SlotReelProps> = ({
  reelIndex,
  isSpinning,
  targetSymbol,
  stopDelayMs,
  isHighlighted = false,
  onStop,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  // Build a long strip of symbols for continuous vertical scrolling animation
  const stripSymbols = useRef<SlotSymbol[]>([]);
  if (stripSymbols.current.length === 0) {
    const arr: SlotSymbol[] = [];
    // Generate 35 continuous symbols
    for (let i = 0; i < 35; i++) {
      const randSym = SLOT_SYMBOLS[i % SLOT_SYMBOLS.length];
      arr.push(randSym);
    }
    stripSymbols.current = arr;
  }

  useEffect(() => {
    if (isSpinning) {
      // Total distance to scroll vertically over the animation duration
      const totalDistance = SYMBOL_HEIGHT * (stripSymbols.current.length - 3);

      translateY.setValue(0);
      Animated.timing(translateY, {
        toValue: -totalDistance,
        duration: stopDelayMs,
        // Smooth bezier easing: fast continuous spin -> smooth deceleration at the end
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }).start(() => {
        onStop();
      });
    }
  }, [isSpinning, stopDelayMs]);

  return (
    <View style={[styles.reelWindow, isHighlighted && styles.reelWindowHighlighted]}>
      {/* Center Payline Gold Overlay */}
      <View style={[styles.centerPaylineOverlay, isHighlighted && styles.centerPaylineGold]} />

      {isSpinning ? (
        /* Continuous Vertical Spinning Strip */
        <Animated.View
          style={[
            styles.reelStrip,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {stripSymbols.current.map((sym, idx) => (
            <View key={`sym-${reelIndex}-${idx}`} style={styles.symbolCell}>
              <Text style={styles.symbolEmojiSpinning}>{sym.emoji}</Text>
            </View>
          ))}
        </Animated.View>
      ) : (
        /* Stopped View displaying Target Symbol on Center Payline Row */
        <View style={styles.staticReel}>
          {/* Top Row */}
          <View style={styles.symbolCellDimmed}>
            <Text style={styles.symbolEmojiDimmed}>
              {SLOT_SYMBOLS[(SLOT_SYMBOLS.findIndex((s) => s.id === targetSymbol.id) + 1) % SLOT_SYMBOLS.length].emoji}
            </Text>
          </View>

          {/* Center Payline Row (Target Symbol) */}
          <View style={[styles.symbolCellActive, isHighlighted && styles.symbolCellMatch]}>
            <Text style={[styles.symbolEmojiActive, isHighlighted && styles.symbolEmojiMatch]}>
              {targetSymbol.emoji}
            </Text>
          </View>

          {/* Bottom Row */}
          <View style={styles.symbolCellDimmed}>
            <Text style={styles.symbolEmojiDimmed}>
              {SLOT_SYMBOLS[(SLOT_SYMBOLS.findIndex((s) => s.id === targetSymbol.id) + 2) % SLOT_SYMBOLS.length].emoji}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reelWindow: {
    flex: 1,
    height: VISIBLE_HEIGHT,
    backgroundColor: CasinoColors.bgDarkest,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderEmerald,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 3,
  },
  reelWindowHighlighted: {
    borderColor: CasinoColors.goldPrimary,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  centerPaylineOverlay: {
    position: 'absolute',
    top: SYMBOL_HEIGHT,
    left: 0,
    right: 0,
    height: SYMBOL_HEIGHT,
    backgroundColor: 'rgba(255, 215, 0, 0.06)',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    zIndex: 5,
    pointerEvents: 'none',
  },
  centerPaylineGold: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: CasinoColors.goldLight,
  },
  reelStrip: {
    alignItems: 'center',
  },
  staticReel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolCell: {
    height: SYMBOL_HEIGHT,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolCellActive: {
    height: SYMBOL_HEIGHT,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 56, 42, 0.4)',
  },
  symbolCellMatch: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderRadius: 8,
  },
  symbolCellDimmed: {
    height: SYMBOL_HEIGHT,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.35,
  },
  symbolEmojiSpinning: {
    fontSize: 32,
  },
  symbolEmojiActive: {
    fontSize: 36,
    textShadowColor: CasinoColors.goldPrimary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  symbolEmojiMatch: {
    fontSize: 40,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  symbolEmojiDimmed: {
    fontSize: 26,
  },
});
