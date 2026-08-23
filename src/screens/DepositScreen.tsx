import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { AmountSelector } from '@/components/AmountSelector';
import { PaymentMethodSelector } from '@/components/PaymentMethodCard';
import { PAYMENT_METHODS, PaymentMethod } from '@/constants/PaymentMethods';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface DepositScreenProps {
  onBack: () => void;
}

export const DepositScreen: React.FC<DepositScreenProps> = ({ onBack }) => {
  const { deposit, showToast } = useBalance();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [noPromoChecked, setNoPromoChecked] = useState<boolean>(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  const handleDepositSubmit = async () => {
    if (selectedAmount === null) {
      showToast('No Amount Selected', 'Please select a deposit amount.', 'error');
      return;
    }

    if (selectedMethod.name === 'Cash G') {
      const success = await deposit(selectedAmount, 'Cash G');
      if (success) onBack();
      return;
    }

    const success = await deposit(selectedAmount, selectedMethod.name);
    if (success) {
      onBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color={CasinoColors.goldPrimary} />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>DEPOSIT</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Selected Amount Card Header */}
        <View style={styles.selectedAmountCard}>
          <Text style={styles.cardSubLabel}>SELECTED DEPOSIT AMOUNT</Text>
          <Text style={styles.cardAmountValue}>
            {selectedAmount !== null ? `₱${selectedAmount.toLocaleString()}` : 'None Selected'}
          </Text>
          <Text style={styles.noticeText}>Deposit Amount Range (₱100 - ₱10,000)</Text>
        </View>

        {/* Amount Selector Buttons Grid */}
        <View style={styles.sectionContainer}>
          <AmountSelector
            selectedAmount={selectedAmount}
            onSelectAmount={(amt) => setSelectedAmount(amt)}
          />
        </View>

        {/* Promotions Option Radio Button */}
        <View style={styles.promoContainer}>
          <Text style={styles.promoSectionTitle}>PROMOTIONS</Text>
          <TouchableOpacity
            style={styles.promoRadioRow}
            onPress={() => setNoPromoChecked(!noPromoChecked)}
            activeOpacity={0.8}
          >
            <View style={[styles.radioOuter, noPromoChecked && styles.radioOuterActive]}>
              {noPromoChecked && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.promoLabelText}>Don't participate in any promotions</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.sectionContainer}>
          <PaymentMethodSelector
            selectedMethodId={selectedMethod.id}
            onSelectMethod={(method) => setSelectedMethod(method)}
          />
        </View>

        {/* Deposit Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.depositSubmitBtn}
            onPress={handleDepositSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.depositSubmitText}>DEPOSIT</Text>
            <Ionicons name="arrow-forward" size={15} color={CasinoColors.bgDarkest} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CasinoColors.bgDarkest,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CasinoColors.borderEmerald,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: CasinoColors.goldPrimary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 4,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 2,
  },
  selectedAmountCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    padding: 18,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardSubLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardAmountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 11,
    color: CasinoColors.textSecondary,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  promoContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: CasinoColors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 14,
  },
  promoSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  promoRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: CasinoColors.borderEmerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterActive: {
    borderColor: CasinoColors.goldPrimary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CasinoColors.goldPrimary,
  },
  promoLabelText: {
    color: CasinoColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    marginBottom: 40,
  },
  depositSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  depositSubmitText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
});
