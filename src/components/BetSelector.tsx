import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PRESET_BETS } from '@/constants/SlotData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface BetSelectorProps {
  currentBet: number;
  balance: number;
  disabled: boolean;
  onSelectBet: (bet: number) => void;
}

export const BetSelector: React.FC<BetSelectorProps> = ({
  currentBet,
  balance,
  disabled,
  onSelectBet,
}) => {
  const currentIndex = PRESET_BETS.indexOf(currentBet);

  const handleDecrease = () => {
    if (disabled) return;
    if (currentIndex > 0) {
      onSelectBet(PRESET_BETS[currentIndex - 1]);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;
    if (currentIndex < PRESET_BETS.length - 1) {
      const nextBet = PRESET_BETS[currentIndex + 1];
      if (nextBet <= balance) {
        onSelectBet(nextBet);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>BET AMOUNT</Text>

      {/* Plus / Minus Main Controls */}
      <View style={styles.mainControlRow}>
        <TouchableOpacity
          style={[styles.stepperButton, (disabled || currentIndex === 0) && styles.stepperDisabled]}
          onPress={handleDecrease}
          disabled={disabled || currentIndex === 0}
          activeOpacity={0.8}
        >
          <Ionicons name="remove" size={24} color={CasinoColors.goldPrimary} />
        </TouchableOpacity>

        <View style={styles.betValueBox}>
          <Text style={styles.betCurrencySymbol}>₱</Text>
          <Text style={styles.betValueText}>{currentBet.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.stepperButton,
            (disabled || currentIndex === PRESET_BETS.length - 1 || PRESET_BETS[currentIndex + 1] > balance) &&
              styles.stepperDisabled,
          ]}
          onPress={handleIncrease}
          disabled={
            disabled ||
            currentIndex === PRESET_BETS.length - 1 ||
            PRESET_BETS[currentIndex + 1] > balance
          }
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={CasinoColors.goldPrimary} />
        </TouchableOpacity>
      </View>

      {/* Preset Bet Pills */}
      <View style={styles.presetPillsRow}>
        {PRESET_BETS.map((amt) => {
          const isSelected = currentBet === amt;
          const isOverBalance = amt > balance;

          return (
            <TouchableOpacity
              key={`preset-${amt}`}
              style={[
                styles.presetPill,
                isSelected && styles.presetPillSelected,
                (disabled || isOverBalance) && styles.presetPillDisabled,
              ]}
              onPress={() => onSelectBet(amt)}
              disabled={disabled || isOverBalance}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.presetPillText,
                  isSelected && styles.presetPillTextSelected,
                  isOverBalance && styles.presetPillTextDisabled,
                ]}
              >
                ₱{amt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  mainControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepperDisabled: {
    borderColor: CasinoColors.borderEmerald,
    backgroundColor: CasinoColors.bgDarkest,
    opacity: 0.4,
  },
  betValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.bgCard,
    borderWidth: 2,
    borderColor: CasinoColors.goldPrimary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
    minWidth: 120,
    justifyContent: 'center',
  },
  betCurrencySymbol: {
    fontSize: 18,
    fontWeight: '800',
    color: CasinoColors.goldSecondary,
    marginRight: 4,
  },
  betValueText: {
    fontSize: 24,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 0.5,
  },
  presetPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    marginHorizontal: 3,
    marginVertical: 3,
  },
  presetPillSelected: {
    backgroundColor: CasinoColors.goldPrimary,
    borderColor: CasinoColors.goldLight,
  },
  presetPillDisabled: {
    backgroundColor: CasinoColors.bgDarkest,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.4,
  },
  presetPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: CasinoColors.textSecondary,
  },
  presetPillTextSelected: {
    color: CasinoColors.bgDarkest,
  },
  presetPillTextDisabled: {
    color: CasinoColors.textMuted,
    textDecorationLine: 'line-through',
  },
});
