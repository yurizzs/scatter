export interface GameItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isFunctional: boolean;
  tagline: string;
  minBet?: string;
  maxMultiplier?: string;
  gradientColors: string[];
}

export const SCATTER_GAMES: GameItem[] = [
  {
    id: 'lucky-spin',
    name: 'Lucky Spin',
    description: 'Spin the luxury wheel for instant demo rewards & multipliers!',
    iconName: 'aperture',
    isFunctional: true,
    tagline: 'PLAY NOW',
    minBet: 'Free Spin',
    maxMultiplier: '500x',
    gradientColors: ['#0D382A', '#1A5E47'],
  },
  {
    id: 'golden-scatter',
    name: 'Golden Scatter',
    description: 'Match golden scatter symbols for mega jackpot payouts.',
    iconName: 'sparkles',
    isFunctional: false,
    tagline: 'COMING SOON',
    minBet: '₱50',
    maxMultiplier: '1000x',
    gradientColors: ['#09261C', '#103E2F'],
  },
  {
    id: 'fortune-coins',
    name: 'Fortune Coins',
    description: 'Flip ancient golden coins to trigger cascading multipliers.',
    iconName: 'disc',
    isFunctional: false,
    tagline: 'COMING SOON',
    minBet: '₱20',
    maxMultiplier: '250x',
    gradientColors: ['#09261C', '#103E2F'],
  },
  {
    id: 'emerald-rush',
    name: 'Emerald Rush',
    description: 'Enter the deep emerald vault for rapid diamond scatters.',
    iconName: 'diamond',
    isFunctional: false,
    tagline: 'COMING SOON',
    minBet: '₱100',
    maxMultiplier: '2000x',
    gradientColors: ['#09261C', '#103E2F'],
  },
  {
    id: 'lucky-7',
    name: 'Lucky 7',
    description: 'Classic 3-reel scatter slots with triple gold sevens.',
    iconName: 'trophy',
    isFunctional: false,
    tagline: 'COMING SOON',
    minBet: '₱10',
    maxMultiplier: '777x',
    gradientColors: ['#09261C', '#103E2F'],
  },
  {
    id: 'treasure-scatter',
    name: 'Treasure Scatter',
    description: 'Unearth hidden chests packed with glowing bonus coins.',
    iconName: 'gift',
    isFunctional: false,
    tagline: 'COMING SOON',
    minBet: '₱50',
    maxMultiplier: '500x',
    gradientColors: ['#09261C', '#103E2F'],
  },
];
