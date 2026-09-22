import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SlotReel } from './SlotReel';
import { SlotSymbol, SLOT_SYMBOLS, SlotResult, evaluateSlotSpin } from '@/constants/SlotData';
import { PatternOutcome, generateReelSymbolsForOutcome } from '@/constants/SpinPattern';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

const SPIN_DURATION_MS = 2000;
const INITIAL_REELS = [
  SLOT_SYMBOLS[4],
  SLOT_SYMBOLS[4],
  SLOT_SYMBOLS[4],
  SLOT_SYMBOLS[4],
];

interface SlotMachineProps {
  isSpinning: boolean;
  betAmount: number;
  targetOutcome?: PatternOutcome;
  onSpinFinish: (result: SlotResult) => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  isSpinning,
  betAmount,
  targetOutcome = 'WIN',
  onSpinFinish,
}) => {
  const { width } = useWindowDimensions();
  const machineWidth = Math.min(width * 0.88, 360);

  const [currentReels, setCurrentReels] = useState<SlotSymbol[]>(INITIAL_REELS);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [lightTick, setLightTick] = useState(0);
  const stoppedCount = useRef(0);
  const spinResultRef = useRef<SlotResult | null>(null);
  const pendingReelsRef = useRef<SlotSymbol[]>(INITIAL_REELS);

  const stopDelays = [SPIN_DURATION_MS, SPIN_DURATION_MS, SPIN_DURATION_MS, SPIN_DURATION_MS];

  useEffect(() => {
    // 120ms rapid neon flickering light strobe
    const timer = setInterval(() => {
      setLightTick((t) => (t + 1) % 4);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  if (isSpinning && !spinResultRef.current) {
    const picked = generateReelSymbolsForOutcome(targetOutcome);
    pendingReelsRef.current = picked;
    spinResultRef.current = evaluateSlotSpin(picked, betAmount);
    stoppedCount.current = 0;
  }

  useEffect(() => {
    if (isSpinning) {
      setHighlightedIndices([]);
    } else {
      spinResultRef.current = null;
    }
  }, [isSpinning]);

  const handleReelStop = (index: number) => {
    stoppedCount.current += 1;

    // All 4 reels stopped at ~2 seconds
    if (stoppedCount.current === 4 && spinResultRef.current) {
      const res = spinResultRef.current;
      const finalReels = pendingReelsRef.current;

      setCurrentReels(finalReels);

      // Highlight winning reel indices (3+ matches)
      if (res.matchesCount >= 3 && res.matchedSymbol) {
        const matches: number[] = [];
        finalReels.forEach((s, idx) => {
          if (s.id === res.matchedSymbol?.id) {
            matches.push(idx);
          }
        });
        setHighlightedIndices(matches);
      }

      requestAnimationFrame(() => {
        onSpinFinish(res);
      });
    }
  };

  const visibleReels = isSpinning ? pendingReelsRef.current : currentReels;
  const NEON_LIGHT_COLORS = ['#FFD700', '#00E5FF', '#00FF99', '#FF007F'];

  return (
    <View style={[styles.machineFrame, { width: machineWidth }]}>
      {/* Top Header Marquee */}
      <View style={styles.marqueeHeader}>
        <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
        <Text style={styles.marqueeText} numberOfLines={1} adjustsFontSizeToFit>Skatter07 LUCKY SPIN</Text>
        <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
      </View>

      {/* Decorative Rapid Flickering Neon Lights Bar */}
      <View style={styles.lightsRow}>
        {[...Array(9)].map((_, i) => {
          const isActive = (i + lightTick) % 2 === 0;
          const color = NEON_LIGHT_COLORS[(i + lightTick) % NEON_LIGHT_COLORS.length];
          return (
            <View
              key={`light-${i}`}
              style={[
                styles.lightDot,
                isActive
                  ? {
                      backgroundColor: color,
                      shadowColor: color,
                      shadowRadius: 8,
                      shadowOpacity: 1,
                      elevation: 6,
                    }
                  : styles.lightDotInactive,
              ]}
            />
          );
        })}
      </View>

      {/* Main 4-Column Reels Container */}
      <View style={styles.reelsContainer}>
        {visibleReels.map((symbol, idx) => (
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
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: CasinoColors.goldPrimary,
    padding: 12,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.95,
    shadowRadius: 24,
    elevation: 16,
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
