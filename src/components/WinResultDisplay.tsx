import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { SlotResult } from '@/constants/SlotData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface WinResultDisplayProps {
  result: SlotResult | null;
  betAmount: number;
}

export const WinResultDisplay: React.FC<WinResultDisplayProps> = ({ result, betAmount }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (result) {
      scaleAnim.setValue(0.75);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [result]);

  if (!result) {
    return (
      <View style={styles.resultBoxIdle}>
        <Ionicons name="help-circle-sharp" size={20} color={CasinoColors.textMuted} />
        <Text style={styles.idleText}>Select your bet amount and press SPIN!</Text>
      </View>
    );
  }

  const { winType, matchesCount, matchedSymbol, winnings } = result;

  return (
    <Animated.View
      style={[
        styles.resultBox,
        winType === 'JACKPOT'
          ? styles.resultBoxJackpot
          : winType === 'WIN'
          ? styles.resultBoxWin
          : styles.resultBoxLose,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {winType === 'JACKPOT' && (
        <View style={styles.centerContent}>
          <View style={styles.headerRow}>
            <Ionicons name="trophy" size={20} color={CasinoColors.goldPrimary} />
            <Text style={styles.titleJackpot}>🎉 JACKPOT!</Text>
            <Ionicons name="trophy" size={20} color={CasinoColors.goldPrimary} />
          </View>

          <Text style={styles.matchSubText}>4 MATCHES ({matchedSymbol?.emoji || '⭐'})</Text>

          <Text style={styles.winningsText}>YOU WON ₱{winnings.toLocaleString()}!</Text>
        </View>
      )}

      {winType === 'WIN' && (
        <View style={styles.centerContent}>
          <View style={styles.headerRow}>
            <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
            <Text style={styles.titleWin}>🎉 YOU WIN!</Text>
            <Ionicons name="sparkles" size={16} color={CasinoColors.goldPrimary} />
          </View>

          <Text style={styles.matchSubText}>3 MATCHES ({matchedSymbol?.emoji || '🍒'})</Text>

          <Text style={styles.winningsText}>YOU WON ₱{winnings.toLocaleString()}!</Text>
        </View>
      )}

      {winType === 'NO MATCH' && (
        <View style={styles.centerContent}>
          <Text style={styles.titleLose}>TRY AGAIN</Text>

          <Text style={styles.matchSubText}>
            {matchesCount === 2 ? `2 MATCHES (${matchedSymbol?.emoji || '⭐'})` : 'NO MATCH'}
          </Text>

          <Text style={styles.loseText}>You lost your ₱{betAmount.toLocaleString()} bet.</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  resultBoxIdle: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: CasinoColors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleText: {
    color: CasinoColors.textMuted,
    fontSize: 12.5,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultBox: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBoxJackpot: {
    backgroundColor: CasinoColors.bgCardElevated,
    borderColor: CasinoColors.goldPrimary,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  resultBoxWin: {
    backgroundColor: CasinoColors.bgCardElevated,
    borderColor: CasinoColors.goldSecondary,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  resultBoxLose: {
    backgroundColor: CasinoColors.bgDarkest,
    borderColor: CasinoColors.borderEmerald,
  },
  centerContent: {
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleJackpot: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  titleWin: {
    fontSize: 20,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1.5,
    marginHorizontal: 6,
  },
  titleLose: {
    fontSize: 18,
    fontWeight: '900',
    color: CasinoColors.textSecondary,
    marginBottom: 4,
  },
  matchSubText: {
    fontSize: 12,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  winningsText: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.emeraldAccent,
    letterSpacing: 1,
  },
  loseText: {
    fontSize: 12,
    color: CasinoColors.textMuted,
  },
});
