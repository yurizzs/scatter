import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PRESET_AMOUNTS } from '@/constants/PaymentMethods';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface AmountSelectorProps {
  selectedAmount: number | null;
  onSelectAmount: (amount: number) => void;
  maxLimit?: number; // Optional balance limit for withdraw mode
}

export const AmountSelector: React.FC<AmountSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
  maxLimit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Select Amount</Text>
      <View style={styles.grid}>
        {PRESET_AMOUNTS.map((amt) => {
          const isSelected = selectedAmount === amt;
          const isDisabled = maxLimit !== undefined && amt > maxLimit;

          return (
            <TouchableOpacity
              key={`amt-${amt}`}
              style={[
                styles.amountButton,
                isSelected && styles.amountButtonSelected,
                isDisabled && styles.amountButtonDisabled,
              ]}
              onPress={() => onSelectAmount(amt)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.amountText,
                  isSelected && styles.amountTextSelected,
                  isDisabled && styles.amountTextDisabled,
                ]}
              >
                ₱{amt.toLocaleString()}
              </Text>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={CasinoColors.bgDarkest} />
                </View>
              )}
              {isDisabled && (
                <Text style={styles.disabledLabel}>Exceeds</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: CasinoColors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  amountButton: {
    width: '30%',
    marginHorizontal: '1.66%',
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderEmerald,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  amountButtonSelected: {
    backgroundColor: CasinoColors.goldPrimary,
    borderColor: CasinoColors.goldLight,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  amountButtonDisabled: {
    backgroundColor: CasinoColors.bgDarkest,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    opacity: 0.6,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: CasinoColors.textPrimary,
  },
  amountTextSelected: {
    color: CasinoColors.bgDarkest,
  },
  amountTextDisabled: {
    color: CasinoColors.textMuted,
    textDecorationLine: 'line-through',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  disabledLabel: {
    fontSize: 9,
    color: CasinoColors.error,
    fontWeight: '700',
    marginTop: 2,
  },
});
