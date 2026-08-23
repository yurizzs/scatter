import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
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
  const [inputText, setInputText] = useState<string>(currentBet.toString());

  // Synchronize internal text state when currentBet prop updates externally
  useEffect(() => {
    setInputText(currentBet.toString());
  }, [currentBet]);

  const handleDecrease = () => {
    if (disabled) return;
    const step = 50;
    const nextBet = Math.max(50, currentBet - step);
    onSelectBet(nextBet);
  };

  const handleIncrease = () => {
    if (disabled) return;
    const step = 50;
    const nextBet = currentBet + step;
    if (balance > 0 && nextBet <= balance) {
      onSelectBet(nextBet);
    } else if (balance > 0) {
      onSelectBet(balance);
    }
  };

  const handleTextChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setInputText(sanitized);

    if (sanitized === '') return;

    let num = parseInt(sanitized, 10);
    if (isNaN(num)) return;

    // Cap at balance if balance > 0
    if (balance > 0 && num > balance) {
      num = balance;
      setInputText(balance.toString());
    }

    if (num > 0) {
      onSelectBet(num);
    }
  };

  const handleBlur = () => {
    if (inputText === '' || parseInt(inputText, 10) <= 0) {
      const fallback = Math.min(50, balance > 0 ? balance : 50);
      setInputText(fallback.toString());
      onSelectBet(fallback);
    }
  };

  const handleMaxBet = () => {
    if (disabled || balance <= 0) return;
    onSelectBet(balance);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>BET AMOUNT</Text>
        <Text style={styles.hintText}>TAP VALUE TO TYPE CUSTOM BET</Text>
      </View>

      {/* Plus / Minus & Direct TextInput Controls */}
      <View style={styles.mainControlRow}>
        <TouchableOpacity
          style={[styles.stepperButton, (disabled || currentBet <= 50) && styles.stepperDisabled]}
          onPress={handleDecrease}
          disabled={disabled || currentBet <= 50}
          activeOpacity={0.8}
        >
          <Ionicons name="remove" size={18} color={CasinoColors.goldPrimary} />
        </TouchableOpacity>

        <View style={styles.betValueBox}>
          <Text style={styles.betCurrencySymbol}>₱</Text>
          <TextInput
            style={styles.betTextInput}
            keyboardType="number-pad"
            value={inputText}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            editable={!disabled}
            selectTextOnFocus
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.stepperButton,
            (disabled || (balance > 0 && currentBet >= balance)) && styles.stepperDisabled,
          ]}
          onPress={handleIncrease}
          disabled={disabled || (balance > 0 && currentBet >= balance)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={CasinoColors.goldPrimary} />
        </TouchableOpacity>
      </View>

      {/* Preset Bet Pills + MAX BET */}
      <View style={styles.presetPillsRow}>
        {PRESET_BETS.map((amt) => {
          const isSelected = currentBet === amt;
          const isOverBalance = balance > 0 && amt > balance;

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

        {/* MAX BET PILL */}
        <TouchableOpacity
          style={[
            styles.presetPill,
            styles.maxBetPill,
            (disabled || balance <= 0) && styles.presetPillDisabled,
          ]}
          onPress={handleMaxBet}
          disabled={disabled || balance <= 0}
          activeOpacity={0.8}
        >
          <Ionicons name="flash-sharp" size={12} color={CasinoColors.bgDarkest} style={{ marginRight: 2 }} />
          <Text style={styles.maxBetText}>MAX BET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'center',
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.2,
  },
  hintText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: CasinoColors.goldSecondary,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  mainControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    marginHorizontal: 10,
    minWidth: 100,
    justifyContent: 'center',
  },
  betCurrencySymbol: {
    fontSize: 15,
    fontWeight: '800',
    color: CasinoColors.goldSecondary,
    marginRight: 3,
  },
  betTextInput: {
    fontSize: 18,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 0.5,
    minWidth: 55,
    textAlign: 'center',
    paddingVertical: 2,
  },
  presetPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    marginHorizontal: 2,
    marginVertical: 2,
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
    fontSize: 10.5,
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
  maxBetPill: {
    backgroundColor: CasinoColors.goldPrimary,
    borderColor: CasinoColors.goldLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  maxBetText: {
    fontSize: 10,
    fontWeight: '900',
    color: CasinoColors.bgDarkest,
    letterSpacing: 0.5,
  },
});
