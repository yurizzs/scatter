import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { SlotMachine } from '@/components/SlotMachine';
import { BetSelector } from '@/components/BetSelector';
import { WinResultDisplay } from '@/components/WinResultDisplay';
import { SlotResult, PRESET_BETS } from '@/constants/SlotData';
import { getPatternStepForSpin, SpinPatternStep } from '@/constants/SpinPattern';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface LuckySpinScreenProps {
  onBack: () => void;
  onOpenDeposit: () => void;
}

export const LuckySpinScreen: React.FC<LuckySpinScreenProps> = ({ onBack, onOpenDeposit }) => {
  const { balance, formattedBalance, deductBet, addSlotWinnings, notifyLoss, spinNumber, incrementSpinNumber, showToast } = useBalance();
  const [selectedBet, setSelectedBet] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<SlotResult | null>(null);
  const [currentPatternStep, setCurrentPatternStep] = useState<SpinPatternStep>(getPatternStepForSpin(1));
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 380;

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

    if (balance === 0) {
      showToast(
        'Deposit Required',
        'Your balance is ₱0.00. Please deposit at least ₱100 to start playing!',
        'error'
      );
      onOpenDeposit();
      return;
    }

    if (balance < selectedBet) {
      showToast(
        'Insufficient Balance',
        'You don\'t have enough balance for this bet. Reduce your bet or add funds.',
        'error'
      );
      return;
    }

    // 1. Get exact pattern outcome for this spin index
    const step = getPatternStepForSpin(spinNumber);
    setCurrentPatternStep(step);
    incrementSpinNumber();

    // 2. Deduct bet immediately ONCE per spin
    const success = deductBet(selectedBet);
    if (!success) return;

    // 3. Start 2-second continuous spinning reels
    setLastResult(null);
    setIsSpinning(true);
  };

  const handleSpinFinish = (result: SlotResult) => {
    setLastResult(result);
    setIsSpinning(false);

    // 4. Add winnings for 3 or 4 matches, or trigger Loss modal for NO_WIN
    if (result.winType === 'JACKPOT') {
      addSlotWinnings(result.winnings, 'JACKPOT');
    } else if (result.winType === 'WIN') {
      addSlotWinnings(result.winnings, 'SLOT WIN');
    } else {
      notifyLoss(selectedBet, 'NO MATCHING SYMBOLS');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation Header Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={isSpinning}>
            <Ionicons name="arrow-back" size={20} color={CasinoColors.goldPrimary} />
            <Text style={styles.backText}>HOME</Text>
          </TouchableOpacity>

          <View style={[styles.headerTitleWrap, isSmallDevice && { flexShrink: 1, marginHorizontal: 4 }]}>
            <View style={[styles.miniLogo, isSmallDevice && { width: 20, height: 20, marginRight: 4 }]}>
              <Ionicons name="sparkles" size={isSmallDevice ? 11 : 14} color={CasinoColors.goldPrimary} />
            </View>
            <Text
              style={[styles.screenTitle, isSmallDevice && { fontSize: 14, letterSpacing: 1 }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              LUCKY SPIN
            </Text>
          </View>

          <TouchableOpacity
            style={styles.depositSmallBtn}
            onPress={onOpenDeposit}
            disabled={isSpinning}
          >
            <Ionicons name="add" size={15} color={CasinoColors.bgDarkest} />
            <Text style={styles.depositSmallText}>FUNDS</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card Header */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Ionicons name="wallet-sharp" size={24} color={CasinoColors.goldPrimary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.balanceHeaderLabel}>BALANCE</Text>
              <Text style={styles.balanceValueText}>{formattedBalance}</Text>
            </View>
          </View>
        </View>

        {/* Slot Machine Main Container */}
        <View style={styles.slotWrapper}>
          <SlotMachine
            isSpinning={isSpinning}
            betAmount={selectedBet}
            targetOutcome={currentPatternStep.outcome}
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
              <Ionicons name="play" size={18} color={CasinoColors.bgDarkest} style={{ marginLeft: 6 }} />
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1.5,
    lineHeight: Platform.OS === 'ios' ? 22 : 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
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
