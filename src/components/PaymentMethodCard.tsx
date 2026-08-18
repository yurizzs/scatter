import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PAYMENT_METHODS, PaymentMethod } from '@/constants/PaymentMethods';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface PaymentMethodCardProps {
  selectedMethodId: string;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodCardProps> = ({
  selectedMethodId,
  onSelectMethod,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <Text style={styles.subHint}>Fictional demo payment options only</Text>

      <View style={styles.cardsRow}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethodId === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardSelected,
              ]}
              onPress={() => onSelectMethod(method)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${method.color}22` }]}>
                <Ionicons name={method.iconName as any} size={24} color={method.color} />
              </View>

              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.badgeText}>{method.badgeText}</Text>

              {/* Radio Check Circle */}
              <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                {isSelected && <View style={styles.radioInnerDot} />}
              </View>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: CasinoColors.textSecondary,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subHint: {
    fontSize: 11,
    color: CasinoColors.textMuted,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderEmerald,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: CasinoColors.goldPrimary,
    backgroundColor: CasinoColors.bgCard,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '800',
    color: CasinoColors.textPrimary,
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 9.5,
    color: CasinoColors.textMuted,
    marginBottom: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderEmerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: CasinoColors.goldPrimary,
  },
  radioInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: CasinoColors.goldPrimary,
  },
});
