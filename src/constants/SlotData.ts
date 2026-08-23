export interface SlotSymbol {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'cherry', emoji: '🍒', name: 'Cherry', color: '#EF4444' },
  { id: 'lemon', emoji: '🍋', name: 'Lemon', color: '#FACC15' },
  { id: 'orange', emoji: '🍊', name: 'Orange', color: '#F97316' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', color: '#38BDF8' },
  { id: 'star', emoji: '⭐', name: 'Star', color: '#FFD700' },
  { id: 'seven', emoji: '7️⃣', name: 'Lucky 7', color: '#EC4899' },
  { id: 'coin', emoji: '🪙', name: 'Gold Coin', color: '#EAB308' },
  { id: 'clover', emoji: '🍀', name: 'Clover', color: '#10B981' },
];

export const PRESET_BETS = [50, 100, 200, 500];

export type WinType = 'JACKPOT' | 'WIN' | 'NO MATCH';

export interface SlotResult {
  symbols: SlotSymbol[];
  matchesCount: number;
  multiplier: number;
  winnings: number;
  winType: WinType;
  matchedSymbol?: SlotSymbol;
}

export const evaluateSlotSpin = (reelsSymbols: SlotSymbol[], betAmount: number): SlotResult => {
  // Count occurrences of each symbol ID
  const counts: Record<string, number> = {};
  reelsSymbols.forEach((s) => {
    counts[s.id] = (counts[s.id] || 0) + 1;
  });

  // Find max match count and matched symbol
  let maxCount = 0;
  let matchedSymId = '';
  Object.entries(counts).forEach(([symId, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      matchedSymId = symId;
    }
  });

  const matchedSymbol = SLOT_SYMBOLS.find((s) => s.id === matchedSymId);

  let multiplier = 0;
  let winType: WinType = 'NO MATCH';

  if (maxCount === 4) {
    multiplier = 10;
    winType = 'JACKPOT';
  } else if (maxCount === 3) {
    multiplier = 3;
    winType = 'WIN';
  } else {
    // 2 or less matches -> No return, no reward!
    multiplier = 0;
    winType = 'NO MATCH';
  }

  const winnings = betAmount * multiplier;

  return {
    symbols: reelsSymbols,
    matchesCount: maxCount,
    multiplier,
    winnings,
    winType,
    matchedSymbol,
  };
};
