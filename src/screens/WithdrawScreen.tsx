import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { AmountSelector } from '@/components/AmountSelector';
import { PaymentMethodSelector } from '@/components/PaymentMethodCard';
import { PAYMENT_METHODS, PaymentMethod } from '@/constants/PaymentMethods';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface WithdrawScreenProps {
  onBack: () => void;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ onBack }) => {
  const { balance, formattedBalance, withdraw, showToast } = useBalance();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  const handleWithdrawSubmit = () => {
    if (selectedAmount === null) {
      showToast('No Amount Selected', 'Please select a withdrawal amount.', 'error');
      return;
    }

    if (selectedAmount > balance) {
      showToast(
        'Insufficient Demo Balance',
        'You cannot withdraw more than your available demo balance.',
        'error'
      );
      return;
    }

    const res = withdraw(selectedAmount, selectedMethod.name);
    if (res.success) {
      onBack();
    }
  };

  const handleSelectAmount = (amt: number) => {
    if (amt > balance) {
      showToast('Insufficient Demo Balance', `₱${amt.toLocaleString()} exceeds your available demo balance.`, 'error');
    } else {
      setSelectedAmount(amt);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation Header */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color={CasinoColors.goldPrimary} />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>WITHDRAW</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Available Demo Balance Header Card */}
        <View style={styles.balanceHeaderCard}>
          <Text style={styles.cardSubLabel}>AVAILABLE DEMO BALANCE</Text>
          <Text style={styles.balanceValueText}>{formattedBalance}</Text>
          <Text style={styles.withdrawNotice}>Minimum withdrawal: ₱200 | Maximum: ₱10,000</Text>
        </View>

        {/* Selected Withdrawal Amount Card */}
        <View style={styles.selectedAmountBox}>
          <Text style={styles.amountBoxLabel}>WITHDRAWAL AMOUNT</Text>
          <Text style={styles.amountBoxValue}>
            {selectedAmount !== null ? `₱${selectedAmount.toLocaleString()}` : 'None Selected'}
          </Text>
        </View>

        {/* Selectable Withdrawal Amount Grid */}
        <View style={styles.sectionContainer}>
          <AmountSelector
            selectedAmount={selectedAmount}
            onSelectAmount={handleSelectAmount}
            maxLimit={balance}
          />
        </View>

        {/* Payment Methods Section */}
        <View style={styles.sectionContainer}>
          <PaymentMethodSelector
            selectedMethodId={selectedMethod.id}
            onSelectMethod={(method) => setSelectedMethod(method)}
          />
        </View>

        {/* Withdraw Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.withdrawSubmitBtn}
            onPress={handleWithdrawSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.withdrawSubmitText}>WITHDRAW</Text>
            <Ionicons name="arrow-forward" size={18} color={CasinoColors.bgDarkest} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawScreen;

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
  balanceHeaderCard: {
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
  balanceValueText: {
    fontSize: 32,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  withdrawNotice: {
    fontSize: 11,
    color: CasinoColors.textSecondary,
  },
  selectedAmountBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: CasinoColors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountBoxLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
  },
  amountBoxValue: {
    fontSize: 18,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  actionContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    marginBottom: 40,
  },
  withdrawSubmitBtn: {
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
  withdrawSubmitText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
});
