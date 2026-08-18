import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { GameCard } from './GameCard';
import { SCATTER_GAMES, GameItem } from '@/constants/GameData';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface GameCarouselProps {
  onSelectGame: (game: GameItem) => void;
}

export const GameCarousel: React.FC<GameCarouselProps> = ({ onSelectGame }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="flame" size={20} color={CasinoColors.goldPrimary} />
          <Text style={styles.sectionTitle}>SCATTER GAMES</Text>
        </View>
        <Text style={styles.scrollHint}>Swipe to view all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={296}
      >
        {SCATTER_GAMES.map((game) => (
          <GameCard key={game.id} game={game} onPress={onSelectGame} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  scrollHint: {
    fontSize: 11,
    color: CasinoColors.textMuted,
    fontWeight: '600',
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 8,
  },
});
