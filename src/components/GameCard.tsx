import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { GameItem } from '@/constants/GameData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface GameCardProps {
  game: GameItem;
  onPress: (game: GameItem) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.72, 280);

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        !game.isFunctional && styles.cardDisabled,
      ]}
      onPress={() => onPress(game)}
      activeOpacity={0.85}
    >
      {/* Outer Gold Border Glow */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, game.isFunctional ? styles.iconBadgeActive : styles.iconBadgeDisabled]}>
          <Ionicons
            name={game.iconName as any}
            size={36}
            color={game.isFunctional ? CasinoColors.goldPrimary : CasinoColors.textMuted}
          />
        </View>

        {/* Coming Soon or Play Now Badge */}
        {game.isFunctional ? (
          <View style={styles.playBadge}>
            <Text style={styles.playBadgeText}>FEATURED</Text>
          </View>
        ) : (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>COMING SOON</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {game.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Max Win</Text>
            <Text style={styles.metaValue}>{game.maxMultiplier}</Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={[styles.actionButtonText, !game.isFunctional && styles.actionDisabledText]}>
              {game.isFunctional ? 'PLAY NOW' : 'LOCKED'}
            </Text>

            <Ionicons
              name={game.isFunctional ? 'play' : 'lock-closed'}
              size={14}
              color={game.isFunctional ? CasinoColors.bgDarkest : CasinoColors.textMuted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderGold,
    padding: 16,
    marginRight: 16,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'space-between',
  },
  cardDisabled: {
    backgroundColor: CasinoColors.bgCard,
    borderColor: CasinoColors.borderEmerald,
    opacity: 0.88,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBadge: {
    width: 62,
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  iconBadgeActive: {
    backgroundColor: CasinoColors.bgDark,
    borderColor: CasinoColors.goldPrimary,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  iconBadgeDisabled: {
    backgroundColor: CasinoColors.bgDarkest,
    borderColor: CasinoColors.borderEmerald,
  },
  playBadge: {
    backgroundColor: CasinoColors.emeraldGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playBadgeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: CasinoColors.goldDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: CasinoColors.goldSecondary,
    fontWeight: '800',
    fontSize: 9.5,
    letterSpacing: 1,
  },
  cardBody: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '800',
    color: CasinoColors.textPrimary,
    marginBottom: 6,
  },
  gameDescription: {
    fontSize: 12.5,
    color: CasinoColors.textSecondary,
    lineHeight: 17,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.15)',
    paddingTop: 12,
  },
  metaBox: {
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: CasinoColors.textMuted,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: CasinoColors.goldPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  actionDisabledText: {
    color: CasinoColors.textMuted,
  },
});
