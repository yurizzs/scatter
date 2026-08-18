import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { GameCarousel } from '@/components/GameCarousel';
import { GameItem } from '@/constants/GameData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onOpenLuckySpin: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenLuckySpin,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const { formattedBalance, showToast } = useBalance();

  const handleSelectGame = (game: GameItem) => {
    if (game.isFunctional && game.id === 'lucky-spin') {
      onOpenLuckySpin();
    } else {
      showToast('COMING SOON', `${game.name} is currently in development for Demo Mode.`, 'info');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.brandGroup}>
            <View style={styles.miniLogo}>
              <Ionicons name="sparkles" size={18} color={CasinoColors.goldPrimary} />
            </View>
            <Text style={styles.brandText}>SCATTER</Text>
          </View>

          {/* Shared Balance Badge */}
          <TouchableOpacity style={styles.balanceBadge} onPress={onOpenProfile}>
            <Ionicons name="wallet-sharp" size={15} color={CasinoColors.goldPrimary} />
            <View style={styles.balanceTextWrap}>
              <Text style={styles.balanceLabel}>DEMO BALANCE</Text>
              <Text style={styles.balanceAmount}>{formattedBalance}</Text>
            </View>
            <View style={styles.addPlusBtn}>
              <Ionicons name="add" size={14} color={CasinoColors.bgDarkest} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Demo Warning Banner */}
        <View style={styles.disclaimerBanner}>
          <Ionicons name="information-circle-outline" size={16} color={CasinoColors.goldLight} />
          <Text style={styles.disclaimerText}>
            DEMO ONLY: Fictional balance & games for UI demonstration. No real money used.
          </Text>
        </View>

        {/* Hero Featured Game Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="trophy" size={12} color={CasinoColors.goldPrimary} />
              <Text style={styles.heroBadgeText}>HOT FEATURED GAME</Text>
            </View>
            <Text style={styles.heroTitle}>Lucky Spin</Text>
            <Text style={styles.heroSub}>
              Spin the circular wheel to win instant demo rewards up to ₱500!
            </Text>

            <TouchableOpacity style={styles.heroPlayButton} onPress={onOpenLuckySpin} activeOpacity={0.85}>
              <Text style={styles.heroPlayText}>SPIN & WIN NOW</Text>
              <Ionicons name="arrow-forward" size={16} color={CasinoColors.bgDarkest} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroGraphic}>
            <View style={styles.heroGraphicRing}>
              <Ionicons name="aperture" size={54} color={CasinoColors.goldPrimary} />
            </View>
          </View>
        </View>

        {/* Section 2: Horizontal Carousel */}
        <GameCarousel onSelectGame={handleSelectGame} />

        {/* Fictional Demo Progressive Jackpot Box */}
        <View style={styles.jackpotCard}>
          <View style={styles.jackpotHeader}>
            <Ionicons name="flame-sharp" size={24} color={CasinoColors.goldPrimary} />
            <Text style={styles.jackpotTitle}>MEGA DEMO JACKPOT</Text>
          </View>
          <Text style={styles.jackpotValue}>₱8,450,920.00</Text>
          <Text style={styles.jackpotSub}>Simulated progressive prize pool updated in real-time</Text>

          <View style={styles.jackpotActions}>
            <TouchableOpacity style={styles.quickDepositBtn} onPress={onOpenDeposit}>
              <Ionicons name="add-circle" size={16} color={CasinoColors.goldPrimary} />
              <Text style={styles.quickDepositText}>ADD DEMO FUNDS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Demo Winners Ticker */}
        <View style={styles.tickerSection}>
          <Text style={styles.tickerHeader}>LIVE DEMO WINNERS</Text>

          <View style={styles.tickerRow}>
            <View style={styles.tickerWinner}>
              <Ionicons name="person-circle" size={24} color={CasinoColors.goldSecondary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.winnerName}>Player_992</Text>
                <Text style={styles.winnerGame}>Lucky Spin</Text>
              </View>
            </View>
            <Text style={styles.winAmount}>+₱500.00</Text>
          </View>

          <View style={styles.tickerRow}>
            <View style={styles.tickerWinner}>
              <Ionicons name="person-circle" size={24} color={CasinoColors.goldSecondary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.winnerName}>LuckyPlayer</Text>
                <Text style={styles.winnerGame}>Demo Reward</Text>
              </View>
            </View>
            <Text style={styles.winAmount}>+₱250.00</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CasinoColors.bgDarkest,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CasinoColors.borderEmerald,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 2,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.goldPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  balanceTextWrap: {
    marginHorizontal: 8,
  },
  balanceLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: CasinoColors.textMuted,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 12.5,
    fontWeight: '800',
    color: CasinoColors.goldPrimary,
  },
  addPlusBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  disclaimerText: {
    color: CasinoColors.goldLight,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  heroContent: {
    flex: 1,
    marginRight: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 1,
    borderColor: CasinoColors.goldDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: CasinoColors.goldPrimary,
    fontSize: 9.5,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.textPrimary,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: CasinoColors.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  heroPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroPlayText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 6,
  },
  heroGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGraphicRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 2,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jackpotCard: {
    marginHorizontal: 16,
    marginVertical: 14,
    backgroundColor: CasinoColors.bgCard,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldSecondary,
    padding: 16,
    alignItems: 'center',
  },
  jackpotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jackpotTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  jackpotValue: {
    fontSize: 28,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
    marginVertical: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  jackpotSub: {
    fontSize: 11,
    color: CasinoColors.textMuted,
    marginBottom: 12,
  },
  jackpotActions: {
    flexDirection: 'row',
  },
  quickDepositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.borderGold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickDepositText: {
    color: CasinoColors.goldPrimary,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: 6,
  },
  tickerSection: {
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 14,
  },
  tickerHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tickerWinner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerName: {
    color: CasinoColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  winnerGame: {
    color: CasinoColors.textMuted,
    fontSize: 10.5,
  },
  winAmount: {
    color: CasinoColors.emeraldAccent,
    fontWeight: '800',
    fontSize: 13,
  },
});
