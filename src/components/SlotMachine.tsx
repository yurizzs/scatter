import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SlotReel } from './SlotReel';
import { SlotSymbol, SLOT_SYMBOLS, SlotResult, evaluateSlotSpin } from '@/constants/SlotData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MACHINE_WIDTH = Math.min(width * 0.92, 360);

interface SlotMachineProps {
  isSpinning: boolean;
  betAmount: number;
  onSpinFinish: (result: SlotResult) => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  isSpinning,
  betAmount,
  onSpinFinish,
}) => {
  // 4 Reel target symbols
  const [currentReels, setCurrentReels] = useState<SlotSymbol[]>([
    SLOT_SYMBOLS[4], // Star
    SLOT_SYMBOLS[4], // Star
    SLOT_SYMBOLS[4], // Star
    SLOT_SYMBOLS[4], // Star
  ]);

  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const stoppedCount = useRef(0);
  const spinResultRef = useRef<SlotResult | null>(null);

  // Staggered stop delays per reel completing right at 2.0 seconds
  const stopDelays = [1700, 1800, 1900, 2000];

  useEffect(() => {
    if (isSpinning) {
      stoppedCount.current = 0;
      setHighlightedIndices([]);

      // Generate target combination upfront
      const randVal = Math.random();
      let picked: SlotSymbol[] = [];

      if (randVal < 0.25) {
        // 25% chance: 4 matching symbols (JACKPOT 10x)
        const jackpotSym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        picked = [jackpotSym, jackpotSym, jackpotSym, jackpotSym];
      } else if (randVal < 0.60) {
        // 35% chance: 3 matching symbols (WIN 3x)
        const winSym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        const otherSym = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(winSym) + 1) % SLOT_SYMBOLS.length];
        picked = [winSym, winSym, winSym, otherSym];
      } else if (randVal < 0.85) {
        // 25% chance: 2 matching symbols (NO MATCH 0x)
        const winSym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        const o1 = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(winSym) + 1) % SLOT_SYMBOLS.length];
        const o2 = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(winSym) + 2) % SLOT_SYMBOLS.length];
        picked = [winSym, winSym, o1, o2];
      } else {
        // 15% chance: 0 matching symbols (NO MATCH 0x)
        const shuffled = [...SLOT_SYMBOLS].sort(() => 0.5 - Math.random());
        picked = shuffled.slice(0, 4);
      }

      setCurrentReels(picked);
      spinResultRef.current = evaluateSlotSpin(picked, betAmount);
    }
  }, [isSpinning, betAmount]);

  const handleReelStop = (index: number) => {
    stoppedCount.current += 1;

    // All 4 reels stopped at ~2 seconds
    if (stoppedCount.current === 4 && spinResultRef.current) {
      const res = spinResultRef.current;

      // Highlight winning reel indices (3+ matches)
      if (res.matchesCount >= 3 && res.matchedSymbol) {
        const matches: number[] = [];
        currentReels.forEach((s, idx) => {
          if (s.id === res.matchedSymbol?.id) {
            matches.push(idx);
          }
        });
        setHighlightedIndices(matches);
      }

      onSpinFinish(res);
    }
  };

  return (
    <View style={styles.machineFrame}>
      {/* Top Header Marquee */}
      <View style={styles.marqueeHeader}>
        <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
        <Text style={styles.marqueeText}>SCATTER LUCKY SPIN</Text>
        <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
      </View>

      {/* Decorative Lights Bar */}
      <View style={styles.lightsRow}>
        {[...Array(9)].map((_, i) => (
          <View
            key={`light-${i}`}
            style={[
              styles.lightDot,
              isSpinning && i % 2 === 0 ? styles.lightDotActive : styles.lightDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Main 4-Column Reels Container */}
      <View style={styles.reelsContainer}>
        {currentReels.map((symbol, idx) => (
          <React.Fragment key={`reel-col-${idx}`}>
            <SlotReel
              reelIndex={idx}
              isSpinning={isSpinning}
              targetSymbol={symbol}
              stopDelayMs={stopDelays[idx]}
              isHighlighted={highlightedIndices.includes(idx)}
              onStop={() => handleReelStop(idx)}
            />
            {idx < 3 && <View style={styles.reelDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Bottom Payline Indicator Subtitle */}
      <View style={styles.paylineLabelBar}>
        <Ionicons name="caret-forward" size={12} color={CasinoColors.goldPrimary} />
        <Text style={styles.paylineText}>CENTER PAYLINE MATCH WINS</Text>
        <Ionicons name="caret-back" size={12} color={CasinoColors.goldPrimary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  machineFrame: {
    width: MACHINE_WIDTH,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: CasinoColors.goldPrimary,
    padding: 12,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  marqueeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldDark,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 8,
  },
  marqueeText: {
    fontSize: 13,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  lightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginBottom: 8,
  },
  lightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lightDotActive: {
    backgroundColor: CasinoColors.goldPrimary,
    shadowColor: CasinoColors.goldPrimary,
    shadowRadius: 6,
    shadowOpacity: 0.9,
  },
  lightDotInactive: {
    backgroundColor: CasinoColors.borderEmerald,
  },
  reelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CasinoColors.bgDarkest,
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: CasinoColors.goldDark,
  },
  reelDivider: {
    width: 2,
    height: '90%',
    backgroundColor: CasinoColors.borderGold,
    opacity: 0.6,
  },
  paylineLabelBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  paylineText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: CasinoColors.goldSecondary,
    letterSpacing: 1,
    marginHorizontal: 6,
  },
});
