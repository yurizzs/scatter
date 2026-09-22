import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { SCATTER_GAMES, GameItem } from '@/constants/GameData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onOpenLuckySpin: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

const GLOW_PALETTES = [
  { primary: '#FFD700', dim: 'rgba(255, 215, 0, 0.3)', bg: 'rgba(255, 215, 0, 0.12)' },   // Gold
  { primary: '#00E5FF', dim: 'rgba(0, 229, 255, 0.3)', bg: 'rgba(0, 229, 255, 0.12)' },   // Cyan
  { primary: '#00FF99', dim: 'rgba(0, 255, 153, 0.3)', bg: 'rgba(0, 255, 153, 0.12)' },   // Neon Emerald
  { primary: '#FF007F', dim: 'rgba(255, 0, 127, 0.3)', bg: 'rgba(255, 0, 127, 0.12)' },   // Hot Pink
  { primary: '#A020F0', dim: 'rgba(160, 32, 240, 0.3)', bg: 'rgba(160, 32, 240, 0.12)' }, // Purple
  { primary: '#FF9900', dim: 'rgba(255, 153, 0, 0.3)', bg: 'rgba(255, 153, 0, 0.12)' },   // Amber
  { primary: '#FF3366', dim: 'rgba(255, 51, 102, 0.3)', bg: 'rgba(255, 51, 102, 0.12)' }, // Bright Ruby
  { primary: '#0099FF', dim: 'rgba(0, 153, 255, 0.3)', bg: 'rgba(0, 153, 255, 0.12)' },   // Electric Blue
  { primary: '#76FF03', dim: 'rgba(118, 255, 3, 0.3)', bg: 'rgba(118, 255, 3, 0.12)' },   // Lime
  { primary: '#FF1744', dim: 'rgba(255, 23, 68, 0.3)', bg: 'rgba(255, 23, 68, 0.12)' },   // Crimson
  { primary: '#1DE9B6', dim: 'rgba(29, 233, 182, 0.3)', bg: 'rgba(29, 233, 182, 0.12)' }, // Turquoise
  { primary: '#FF6E40', dim: 'rgba(255, 110, 64, 0.3)', bg: 'rgba(255, 110, 64, 0.12)' }, // Coral
  { primary: '#E040FB', dim: 'rgba(224, 64, 251, 0.3)', bg: 'rgba(224, 64, 251, 0.12)' }, // Neon Violet
  { primary: '#00F5FF', dim: 'rgba(0, 245, 255, 0.3)', bg: 'rgba(0, 245, 255, 0.12)' },   // Ice Blue
  { primary: '#FFAB00', dim: 'rgba(255, 171, 0, 0.3)', bg: 'rgba(255, 171, 0, 0.12)' },   // Solar Flare
  { primary: '#EE82EE', dim: 'rgba(238, 130, 238, 0.3)', bg: 'rgba(238, 130, 238, 0.12)' },// Lavender
];

interface GlowingGameCardProps {
  game: GameItem;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

const GlowingGameCard: React.FC<GlowingGameCardProps> = ({ game, index, isSelected, onPress }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const isLuckySpin = game.id === 'lucky-spin';
  const palette = GLOW_PALETTES[index % GLOW_PALETTES.length];

  useEffect(() => {
    // Rapid neon flicker delay & fast 140-220ms pulse duration
    const delay = (index % 4) * 50;
    const duration = 140 + (index % 5) * 30;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: duration * 0.7,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.85,
          duration: duration * 0.8,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [glowAnim, index]);

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.primary + '80', palette.primary],
  });

  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1.0],
  });

  const animatedShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 26],
  });

  const animatedBg = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(13, 56, 42, 0.95)', palette.bg],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.cardTouchable}>
      <Animated.View
        style={[
          styles.gameCard,
          {
            borderColor: isSelected ? CasinoColors.goldPrimary : animatedBorderColor,
            shadowColor: palette.primary,
            shadowOpacity: isSelected ? 1.0 : animatedShadowOpacity,
            shadowRadius: isSelected ? 20 : animatedShadowRadius,
            backgroundColor: animatedBg,
          },
          isLuckySpin && styles.hotGameCard,
        ]}
      >
        <View
          style={[
            styles.iconAura,
            {
              borderColor: palette.primary,
              backgroundColor: palette.primary + '30',
              shadowColor: palette.primary,
              shadowOpacity: 1.0,
              shadowRadius: 14,
              elevation: 8,
            },
            isLuckySpin && styles.hotIconAura,
          ]}
        >
          <Ionicons name={game.iconName as any} size={25} color={palette.primary} />
        </View>
        <Text
          style={[
            styles.gameName,
            {
              color: palette.primary,
              textShadowColor: palette.primary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            },
          ]}
          numberOfLines={1}
        >
          {game.name}
        </Text>

        {isLuckySpin && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>HOT</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenLuckySpin,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const { balance, formattedBalance, showToast } = useBalance();
  const [selectedGameId, setSelectedGameId] = useState<string>('lucky-spin');
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 380;
  const isVerySmallDevice = width < 340;

  const handleSelectGame = (game: GameItem) => {
    setSelectedGameId(game.id);
    if (game.id === 'lucky-spin') {
      handlePlayNow();
    } else {
      showToast('COMING SOON', `${game.name} is currently in development. Tap PLAY NOW to play Lucky Spin!`, 'info');
    }
  };

  const handlePlayNow = () => {
    if (balance === 0) {
      showToast('Deposit Required', 'Please deposit at least ₱100 to start playing!', 'info');
      onOpenDeposit();
      return;
    }
    onOpenLuckySpin();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top Header Bar */}
          <View style={styles.headerBar}>
            {/* Profile Button / Left Action */}
            <TouchableOpacity style={styles.profileHeaderBtn} onPress={onOpenProfile} activeOpacity={0.8}>
              <Ionicons name="person-circle-sharp" size={24} color={CasinoColors.goldPrimary} />
            </TouchableOpacity>

            {/* Centered App Logo & Title - Perfectly Centered */}
            <View style={styles.centeredBrandGroup} pointerEvents="none">
              <View style={styles.miniLogo}>
                <Ionicons name="sparkles" size={13} color={CasinoColors.goldPrimary} />
              </View>
              <Text style={styles.brandText} numberOfLines={1}>
                Skatter07
              </Text>
            </View>

            {/* Shared Balance Badge - Compact & Sleek */}
            <TouchableOpacity style={styles.balanceBadge} onPress={onOpenProfile} activeOpacity={0.8}>
              <Ionicons name="wallet-sharp" size={11} color={CasinoColors.goldPrimary} />
              <View style={styles.balanceTextWrap}>
                <Text style={styles.balanceLabel}>BALANCE</Text>
                <Text style={styles.balanceAmount}>{formattedBalance}</Text>
              </View>
              <View style={styles.addPlusBtn}>
                <Ionicons name="add" size={10} color={CasinoColors.bgDarkest} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Zero Balance Callout if balance === 0 */}
          {balance === 0 && (
            <View style={styles.zeroBalanceCard}>
              <View style={styles.zeroBalanceHeader}>
                <Ionicons name="wallet-outline" size={18} color={CasinoColors.goldPrimary} />
                <Text style={styles.zeroBalanceTitle}>INITIAL DEPOSIT REQUIRED</Text>
              </View>
              <Text style={styles.zeroBalanceSub}>
                Balance is ₱0.00. Deposit at least ₱100 to play!
              </Text>
              <TouchableOpacity style={styles.zeroDepositBtn} onPress={onOpenDeposit} activeOpacity={0.85}>
                <Ionicons name="arrow-down-circle-sharp" size={15} color={CasinoColors.bgDarkest} />
                <Text style={styles.zeroDepositBtnText}>DEPOSIT ₱100 NOW</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3x3 Grid Frame of Glowing Game Icons with Blinking Borders */}
          <View style={styles.gridFrame}>
            <Text style={styles.sectionHeader}>SELECT CASINO GAME</Text>
            <View style={styles.gridContainer}>
              {SCATTER_GAMES.slice(0, 9).map((game, index) => (
                <GlowingGameCard
                  key={game.id}
                  game={game}
                  index={index}
                  isSelected={game.id === selectedGameId}
                  onPress={() => handleSelectGame(game)}
                />
              ))}
            </View>
          </View>

          {/* Big Bottom Play Now Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.playNowBtn}
              onPress={handlePlayNow}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle-sharp" size={22} color={CasinoColors.bgDarkest} />
              <Text style={styles.playNowText}>PLAY NOW</Text>
              <Ionicons name="sparkles" size={18} color={CasinoColors.bgDarkest} />
            </TouchableOpacity>
            <Text style={styles.playNowSub}>LUCKY SPIN SLOT MACHINE</Text>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: CasinoColors.borderEmerald,
    position: 'relative',
  },
  profileHeaderBtn: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    width: 32,
  },
  centeredBrandGroup: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    marginRight: 5,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1.5,
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.bgCardElevated,
    borderWidth: 1,
    borderColor: CasinoColors.goldPrimary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 14,
    zIndex: 2,
  },
  balanceTextWrap: {
    marginHorizontal: 4,
  },
  balanceLabel: {
    fontSize: 7,
    fontWeight: '700',
    color: CasinoColors.textMuted,
    letterSpacing: 0.5,
    lineHeight: 8,
  },
  balanceAmount: {
    fontSize: 10.5,
    fontWeight: '800',
    color: CasinoColors.goldPrimary,
    lineHeight: 12,
  },
  addPlusBtn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeroBalanceCard: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CasinoColors.goldPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  zeroBalanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  zeroBalanceTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
    marginLeft: 6,
  },
  zeroBalanceSub: {
    fontSize: 11,
    color: CasinoColors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  zeroDepositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  zeroDepositBtnText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: 4,
  },
  gridFrame: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardTouchable: {
    width: '31%',
    aspectRatio: 0.95,
    marginBottom: 12,
  },
  gameCard: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    position: 'relative',
    elevation: 4,
  },
  hotGameCard: {
    borderWidth: 2,
  },
  iconAura: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  hotIconAura: {
    borderWidth: 2,
  },
  gameName: {
    fontSize: 9.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  hotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: CasinoColors.goldPrimary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  hotBadgeText: {
    color: CasinoColors.bgDarkest,
    fontSize: 8,
    fontWeight: '900',
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  playNowBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: CasinoColors.goldPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  playNowText: {
    color: CasinoColors.bgDarkest,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  playNowSub: {
    fontSize: 10,
    fontWeight: '800',
    color: CasinoColors.goldLight,
    letterSpacing: 1.5,
    marginTop: 6,
  },
});
