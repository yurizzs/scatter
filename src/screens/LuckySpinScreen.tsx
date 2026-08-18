import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { SlotMachine } from '@/components/SlotMachine';
import { BetSelector } from '@/components/BetSelector';
import { WinResultDisplay } from '@/components/WinResultDisplay';
import { SlotResult, PRESET_BETS } from '@/constants/SlotData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface LuckySpinScreenProps {
  onBack: () => void;
  onOpenDeposit: () => void;
}

export const LuckySpinScreen: React.FC<LuckySpinScreenProps> = ({ onBack, onOpenDeposit }) => {
  const { balance, formattedBalance, deductBet, addSlotWinnings, showToast } = useBalance();
  const [selectedBet, setSelectedBet] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<SlotResult | null>(null);

  // Automatically adjust bet down if current balance drops below selected bet
  useEffect(() => {
    if (selectedBet > balance && balance > 0) {
      const validBets = PRESET_BETS.filter((b) => b <= balance);
      if (validBets.length > 0) {
        setSelectedBet(validBets[validBets.length - 1]);
      }
    }
  }, [balance, selectedBet]);

  const handleStartSpin = () => {
    if (isSpinning) return;

    if (balance < selectedBet) {
      showToast(
        'Insufficient Demo Balance',
        'You don\'t have enough demo balance for this bet. Reduce your bet or deposit demo funds.',
        'error'
      );
      return;
    }

    // 1. Deduct bet immediately ONCE per spin
    const success = deductBet(selectedBet);
    if (!success) return;

    // 2. Start 2-second continuous spinning reels
    setLastResult(null);
    setIsSpinning(true);
  };

  const handleSpinFinish = (result: SlotResult) => {
    setLastResult(result);
    setIsSpinning(false);

    // 3. Add winnings only for 3 or 4 matches (no money returned for <= 2 matches)
    if (result.winType === 'JACKPOT') {
      addSlotWinnings(result.winnings, 'JACKPOT (4 Matches)');
    } else if (result.winType === 'WIN') {
      addSlotWinnings(result.winnings, 'WIN (3 Matches)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation Header Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={isSpinning}>
            <Ionicons name="arrow-back" size={22} color={CasinoColors.goldPrimary} />
            <Text style={styles.backText}>HOME</Text>
          </TouchableOpacity>

          <Text style={styles.screenTitle}>LUCKY SPIN</Text>

          <TouchableOpacity
            style={styles.depositSmallBtn}
            onPress={onOpenDeposit}
            disabled={isSpinning}
          >
            <Ionicons name="add" size={16} color={CasinoColors.bgDarkest} />
            <Text style={styles.depositSmallText}>FUNDS</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Balance Card Header */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Ionicons name="wallet-sharp" size={26} color={CasinoColors.goldPrimary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.balanceHeaderLabel}>DEMO BALANCE</Text>
              <Text style={styles.balanceValueText}>{formattedBalance}</Text>
            </View>
          </View>
        </View>

        {/* Slot Machine Main Container */}
        <View style={styles.slotWrapper}>
          <SlotMachine
            isSpinning={isSpinning}
            betAmount={selectedBet}
            onSpinFinish={handleSpinFinish}
          />
        </View>

        {/* Bet Selection Controls */}
        <BetSelector
          currentBet={selectedBet}
          balance={balance}
          disabled={isSpinning}
          onSelectBet={(bet) => setSelectedBet(bet)}
        />

        {/* Large SPIN Action Button */}
        <View style={styles.spinButtonWrapper}>
          <TouchableOpacity
            style={[styles.spinButton, (isSpinning || balance < selectedBet) && styles.spinButtonDisabled]}
            onPress={handleStartSpin}
            disabled={isSpinning}
            activeOpacity={0.85}
          >
            <Text style={styles.spinButtonText}>{isSpinning ? 'SPINNING...' : 'SPIN'}</Text>
            {!isSpinning && (
              <Ionicons name="play" size={20} color={CasinoColors.bgDarkest} style={{ marginLeft: 6 }} />
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Result Box Display */}
        <WinResultDisplay result={lastResult} betAmount={selectedBet} />

        {/* Payout & Multiplier Rules Information */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>MATCHING RULES & PAYTABLE</Text>
          <View style={styles.rulesGrid}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleLabel}>4 MATCHES (JACKPOT)</Text>
              <Text style={styles.ruleValue}>10× BET</Text>
            </View>

            <View style={styles.ruleItem}>
              <Text style={styles.ruleLabel}>3 MATCHES (WIN)</Text>
              <Text style={styles.ruleValue}>3× BET</Text>
            </View>

            <View style={styles.ruleItem}>
              <Text style={styles.ruleLabel}>2 MATCHES</Text>
              <Text style={styles.ruleValue}>NO REWARD (0×)</Text>
            </View>

            <View style={styles.ruleItem}>
              <Text style={styles.ruleLabel}>0 - 1 MATCHES</Text>
              <Text style={styles.ruleValue}>NO REWARD (0×)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LuckySpinScreen;

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
  depositSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  depositSmallText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 10.5,
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    padding: 14,
    alignItems: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceHeaderLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
  },
  balanceValueText: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
  },
  slotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  spinButtonWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  spinButton: {
    width: '80%',
    maxWidth: 280,
    height: 54,
    borderRadius: 27,
    backgroundColor: CasinoColors.goldPrimary,
    borderWidth: 2,
    borderColor: CasinoColors.goldGradientStart,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: CasinoColors.bgCardElevated,
    borderColor: CasinoColors.borderEmerald,
    opacity: 0.5,
  },
  spinButtonText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },
  rulesCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    marginBottom: 35,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 14,
  },
  rulesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  rulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ruleItem: {
    width: '48%',
    backgroundColor: CasinoColors.bgDark,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
  },
  ruleLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: CasinoColors.textMuted,
  },
  ruleValue: {
    fontSize: 13,
    fontWeight: '800',
    color: CasinoColors.goldPrimary,
    marginTop: 2,
  },
});
