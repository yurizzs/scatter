import React, { useEffect, useRef, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const onStopRef = useRef(onStop);
  const [spinFrame, setSpinFrame] = useState(0);

  const spinningSymbols = useMemo(() => {
    const arr: SlotSymbol[] = [];

    for (let i = 0; i < SLOT_SYMBOLS.length; i++) {
      arr.push(SLOT_SYMBOLS[(i + reelIndex * 2) % SLOT_SYMBOLS.length]);
    }

    return arr;
  }, [reelIndex]);

  const stripSymbols = useMemo(() => {
    const arr: SlotSymbol[] = [];
    const targetIdx = SLOT_SYMBOLS.findIndex((s) => s.id === targetSymbol.id);
    const safeTargetIdx = targetIdx >= 0 ? targetIdx : 0;
    const prevIdx = (safeTargetIdx + 1) % SLOT_SYMBOLS.length;
    const nextIdx = (safeTargetIdx + 2) % SLOT_SYMBOLS.length;

    arr.push(SLOT_SYMBOLS[prevIdx]); // Top row
    arr.push(targetSymbol);          // Center payline row
    arr.push(SLOT_SYMBOLS[nextIdx]); // Bottom row

    return arr;
  }, [targetSymbol, reelIndex]);

  const visibleSpinSymbols = useMemo(() => {
    const base = spinFrame % spinningSymbols.length;

    return [
      spinningSymbols[base],
      spinningSymbols[(base + 1) % spinningSymbols.length],
      spinningSymbols[(base + 2) % spinningSymbols.length],
    ];
  }, [spinFrame, spinningSymbols]);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  useEffect(() => {
    if (isSpinning) {
      setSpinFrame(0);
      spinTimer.current = setInterval(() => {
        setSpinFrame((frame) => frame + 1);
      }, 58);
      stopTimer.current = setTimeout(() => {
        onStopRef.current();
      }, stopDelayMs);
    } else {
      if (spinTimer.current) {
        clearInterval(spinTimer.current);
        spinTimer.current = null;
      }
      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }
      setSpinFrame(0);
    }

    return () => {
      if (spinTimer.current) {
        clearInterval(spinTimer.current);
        spinTimer.current = null;
      }
      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }
    };
  }, [isSpinning, stopDelayMs]);

  return (
    <View style={[styles.reelWindow, isHighlighted && styles.reelWindowHighlighted]}>
      {/* Center Payline Gold Overlay */}
      <View style={[styles.centerPaylineOverlay, isHighlighted && styles.centerPaylineGold]} />

      {isSpinning ? (
        /* Continuous visible spin: keep all rows filled until the final result replaces them */
        <View style={styles.reelStrip}>
          {visibleSpinSymbols.map((sym: SlotSymbol, idx: number) => (
            <View key={`sym-${reelIndex}-${idx}`} style={styles.symbolCell}>
              <Text style={styles.symbolEmojiSpinning}>{sym.emoji}</Text>
            </View>
          ))}
        </View>
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 16,
    elevation: 10,
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
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  symbolEmojiMatch: {
    fontSize: 40,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  symbolEmojiDimmed: {
    fontSize: 26,
  },
});
