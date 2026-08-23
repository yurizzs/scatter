import { SlotSymbol, SLOT_SYMBOLS } from './SlotData';

export type PatternOutcome = 'JACKPOT' | 'WIN' | 'LOSE';

export interface SpinPatternStep {
  spinIndex: number;
  outcome: PatternOutcome;
  label: string;
  description: string;
}

export const FIXED_SPIN_PATTERN: SpinPatternStep[] = [
  // spin 1 - 2 = win 100 to 250
  { spinIndex: 1, outcome: 'WIN', label: 'Spin 1: Win', description: 'Win (100 -> 175)' },
  { spinIndex: 2, outcome: 'WIN', label: 'Spin 2: Win', description: 'Win (175 -> 250)' },

  // spin 3 = win 250 to 500
  { spinIndex: 3, outcome: 'WIN', label: 'Spin 3: Big Win', description: 'Win (250 -> 500)' },

  // spin 4 = win 500 to 1000
  { spinIndex: 4, outcome: 'JACKPOT', label: 'Spin 4: Jackpot!', description: 'Jackpot (500 -> 1,000)' },

  // spin 5 = lose 1000 to 600
  { spinIndex: 5, outcome: 'LOSE', label: 'Spin 5: Lose', description: 'Lose (1,000 -> 600)' },

  // spin 6 = win 600 to 750
  { spinIndex: 6, outcome: 'WIN', label: 'Spin 6: Win', description: 'Win (600 -> 750)' },

  // spin 7 - 9 = lose 750 to 300
  { spinIndex: 7, outcome: 'LOSE', label: 'Spin 7: Lose', description: 'Lose (750 -> 600)' },
  { spinIndex: 8, outcome: 'LOSE', label: 'Spin 8: Lose', description: 'Lose (600 -> 450)' },
  { spinIndex: 9, outcome: 'LOSE', label: 'Spin 9: Lose', description: 'Lose (450 -> 300)' },

  // spin 10 = win 300 to 500
  { spinIndex: 10, outcome: 'WIN', label: 'Spin 10: Win', description: 'Win (300 -> 500)' },

  // spin 11 - 13 = win 500 to 2000
  { spinIndex: 11, outcome: 'WIN', label: 'Spin 11: Win', description: 'Win (500 -> 1,000)' },
  { spinIndex: 12, outcome: 'WIN', label: 'Spin 12: Win', description: 'Win (1,000 -> 1,500)' },
  { spinIndex: 13, outcome: 'JACKPOT', label: 'Spin 13: Mega Jackpot!', description: 'Jackpot (1,500 -> 2,000)' },

  // spin 14 - 15 = lose 2000 to 1500
  { spinIndex: 14, outcome: 'LOSE', label: 'Spin 14: Lose', description: 'Lose (2,000 -> 1,750)' },
  { spinIndex: 15, outcome: 'LOSE', label: 'Spin 15: Lose', description: 'Lose (1,750 -> 1,500)' },

  // spin 16 - 18 = win 1500 to 1750
  { spinIndex: 16, outcome: 'WIN', label: 'Spin 16: Win', description: 'Win (1,500 -> 1,580)' },
  { spinIndex: 17, outcome: 'WIN', label: 'Spin 17: Win', description: 'Win (1,580 -> 1,665)' },
  { spinIndex: 18, outcome: 'WIN', label: 'Spin 18: Win', description: 'Win (1,665 -> 1,750)' },

  // spin 19 - 22 = lose 1750 to 500
  { spinIndex: 19, outcome: 'LOSE', label: 'Spin 19: Lose', description: 'Lose (1,750 -> 1,440)' },
  { spinIndex: 20, outcome: 'LOSE', label: 'Spin 20: Lose', description: 'Lose (1,440 -> 1,130)' },
  { spinIndex: 21, outcome: 'LOSE', label: 'Spin 21: Lose', description: 'Lose (1,130 -> 820)' },
  { spinIndex: 22, outcome: 'LOSE', label: 'Spin 22: Lose', description: 'Lose (820 -> 500)' },

  // spin 23 - 24 = lose 500 to 200
  { spinIndex: 23, outcome: 'LOSE', label: 'Spin 23: Lose', description: 'Lose (500 -> 350)' },
  { spinIndex: 24, outcome: 'LOSE', label: 'Spin 24: Lose', description: 'Lose (350 -> 200)' },

  // spin 25 = win 600
  { spinIndex: 25, outcome: 'JACKPOT', label: 'Spin 25: Win 600', description: 'Win (200 -> 600)' },

  // spin 26 - 27 = lose 0
  { spinIndex: 26, outcome: 'LOSE', label: 'Spin 26: Lose', description: 'Lose (600 -> 300)' },
  { spinIndex: 27, outcome: 'LOSE', label: 'Spin 27: Lose 0', description: 'Lose (300 -> 0)' },

  // spin 28 = lose 0
  { spinIndex: 28, outcome: 'LOSE', label: 'Spin 28: Lose 0', description: 'Lose (0)' },

  // spin 29 = win 750
  { spinIndex: 29, outcome: 'JACKPOT', label: 'Spin 29: Win 750', description: 'Win (0 -> 750)' },

  // spin 30 = lose 0
  { spinIndex: 30, outcome: 'LOSE', label: 'Spin 30: Lose', description: 'Lose (750 -> 375)' },

  // spin 31 = lose 0
  { spinIndex: 31, outcome: 'LOSE', label: 'Spin 31: Lose 0', description: 'Lose (375 -> 0)' },

  // spin 32 = lose 10,000 to 8,500
  { spinIndex: 32, outcome: 'LOSE', label: 'Spin 32: Lose', description: 'Lose (10,000 -> 8,500)' },

  // spin 33 = lose 8,500 to 6,200
  { spinIndex: 33, outcome: 'LOSE', label: 'Spin 33: Lose', description: 'Lose (8,500 -> 6,200)' },

  // spin 34 = win 6,200 to 8,000
  { spinIndex: 34, outcome: 'WIN', label: 'Spin 34: Win', description: 'Win (6,200 -> 8,000)' },

  // spin 35 = win 8,000 to 12,000
  { spinIndex: 35, outcome: 'JACKPOT', label: 'Spin 35: Mega Win', description: 'Win (8,000 -> 12,000)' },

  // spin 36 = lose 12,000 to 0
  { spinIndex: 36, outcome: 'LOSE', label: 'Spin 36: Final Lose', description: 'Lose (12,000 -> 0)' },
];

export const getPatternStepForSpin = (spinNumber: number): SpinPatternStep => {
  const normalizedIndex = ((spinNumber - 1) % FIXED_SPIN_PATTERN.length);
  return FIXED_SPIN_PATTERN[normalizedIndex];
};

export const generateReelSymbolsForOutcome = (outcome: PatternOutcome): SlotSymbol[] => {
  if (outcome === 'JACKPOT') {
    // 4 matching symbols (JACKPOT 10x)
    const jackpotSym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    return [jackpotSym, jackpotSym, jackpotSym, jackpotSym];
  }

  if (outcome === 'WIN') {
    // 3 matching symbols (WIN 3x)
    const winSym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const otherSym = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(winSym) + 1) % SLOT_SYMBOLS.length];
    return [winSym, winSym, winSym, otherSym];
  }

  // LOSE: 2 or less matching symbols (NO REWARD)
  const sym1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
  const sym2 = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(sym1) + 1) % SLOT_SYMBOLS.length];
  const sym3 = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(sym1) + 2) % SLOT_SYMBOLS.length];
  const sym4 = SLOT_SYMBOLS[(SLOT_SYMBOLS.indexOf(sym1) + 3) % SLOT_SYMBOLS.length];
  return [sym1, sym1, sym2, sym3];
};
