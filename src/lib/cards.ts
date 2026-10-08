import { Card, Suit, Meld, HandAnalysis } from '../types';

export const SUITS: Suit[] = ['oros', 'copas', 'espadas', 'bastos'];
// In standard 40-card Spanish deck, numbers are 1,2,3,4,5,6,7, 10(Sota), 11(Caballo), 12(Rey)
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

// Returns rank sequence index (1->0, 2->1, ... 7->6, 10->7, 11->8, 12->9)
export function getRankIndex(number: number): number {
  const idx = RANKS.indexOf(number);
  return idx !== -1 ? idx : number;
}

export function getCardPoints(number: number, isJoker?: boolean): number {
  if (isJoker) return 25;
  if (number >= 10) return 10;
  return number;
}

export function createDeck(includeJoker: boolean = true): Card[] {
  const cards: Card[] = [];
  let idCounter = 1;

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `card_${idCounter++}`,
        suit,
        number: rank,
        points: getCardPoints(rank),
      });
    }
  }

  if (includeJoker) {
    cards.push({
      id: `card_${idCounter++}`,
      suit: 'oros', // dummy suit
      number: 0,
      isJoker: true,
      points: 25,
    });
  }

  return cards;
}

export function shuffleDeck<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sortCardsBySuit(cards: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { oros: 1, copas: 2, espadas: 3, bastos: 4 };
  return [...cards].sort((a, b) => {
    if (a.isJoker) return 1;
    if (b.isJoker) return -1;
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return getRankIndex(a.number) - getRankIndex(b.number);
  });
}

export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    if (a.isJoker) return 1;
    if (b.isJoker) return -1;
    if (a.number !== b.number) {
      return getRankIndex(a.number) - getRankIndex(b.number);
    }
    return a.suit.localeCompare(b.suit);
  });
}

// Check if a group of 3 or 4 cards is a valid Set/Trio/Cuarteto
export function isValidTrio(cards: Card[]): boolean {
  if (cards.length < 3 || cards.length > 4) return false;
  
  const jokers = cards.filter(c => c.isJoker);
  const nonJokers = cards.filter(c => !c.isJoker);

  if (nonJokers.length === 0) return false;

  // All non-jokers must have same number
  const targetNumber = nonJokers[0].number;
  if (!nonJokers.every(c => c.number === targetNumber)) return false;

  // Non-jokers must have distinct suits
  const suits = new Set(nonJokers.map(c => c.suit));
  if (suits.size !== nonJokers.length) return false;

  // Total count = nonJokers + jokers
  return nonJokers.length + jokers.length >= 3 && nonJokers.length + jokers.length <= 4;
}

// Check if a group of 3+ cards is a valid Escalera (Run)
export function isValidRun(cards: Card[]): boolean {
  if (cards.length < 3) return false;

  const jokers = cards.filter(c => c.isJoker);
  const nonJokers = cards.filter(c => !c.isJoker);

  if (nonJokers.length === 0) return false;

  // All non-jokers must be same suit
  const targetSuit = nonJokers[0].suit;
  if (!nonJokers.every(c => c.suit === targetSuit)) return false;

  // Sort non-jokers by rank index
  const sorted = [...nonJokers].sort((a, b) => getRankIndex(a.number) - getRankIndex(b.number));
  
  // Check if non-jokers can form a contiguous sequence with available jokers
  let jokersAvailable = jokers.length;
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = getRankIndex(sorted[i + 1].number) - getRankIndex(sorted[i].number);
    if (diff === 0) return false; // Duplicate numbers in same suit can't form a run
    if (diff > 1) {
      const gaps = diff - 1;
      if (jokersAvailable >= gaps) {
        jokersAvailable -= gaps;
      } else {
        return false;
      }
    }
  }

  return true;
}

// Main Solver: Find optimal melds for a player's hand to minimize unmatched points
export function analyzeHand(hand: Card[], closeThreshold: number = 5): HandAnalysis {
  if (hand.length === 0) {
    return {
      melds: [],
      unmatchedCards: [],
      unmatchedPoints: 0,
      canClose: true,
      isCleanClose: true,
      isChinchon: false,
    };
  }

  // 1. Check for 7-card Chinchón (7 consecutive cards of same suit without Joker)
  if (hand.length === 7) {
    const nonJokers = hand.filter(c => !c.isJoker);
    if (nonJokers.length === 7 && new Set(nonJokers.map(c => c.suit)).size === 1) {
      const sorted = [...nonJokers].sort((a, b) => getRankIndex(a.number) - getRankIndex(b.number));
      let isStrictRun = true;
      for (let i = 0; i < sorted.length - 1; i++) {
        if (getRankIndex(sorted[i + 1].number) - getRankIndex(sorted[i].number) !== 1) {
          isStrictRun = false;
          break;
        }
      }
      if (isStrictRun) {
        return {
          melds: [{
            id: 'meld_chinchon',
            type: 'chinchon',
            cards: hand,
            suit: hand[0].suit,
          }],
          unmatchedCards: [],
          unmatchedPoints: 0,
          canClose: true,
          isCleanClose: true,
          isChinchon: true,
        };
      }
    }
  }

  // 2. Find all possible candidate melds
  const candidateMelds: { type: 'trio' | 'cuarteto' | 'escalera'; cards: Card[] }[] = [];

  // Find subset combinations of size 3 to 7
  const powerSet = getSubsets(hand, 3, 7);

  for (const subset of powerSet) {
    if (isValidTrio(subset)) {
      candidateMelds.push({
        type: subset.length === 4 ? 'cuarteto' : 'trio',
        cards: subset,
      });
    } else if (isValidRun(subset)) {
      candidateMelds.push({
        type: 'escalera',
        cards: subset,
      });
    }
  }

  // 3. Backtracking search to find mutually disjoint set of melds that minimizes unmatched card points
  let bestMelds: Meld[] = [];
  let minUnmatchedPoints = Infinity;
  let bestUnmatchedCards: Card[] = [...hand];

  function search(index: number, currentMelds: Meld[], usedCardIds: Set<string>) {
    // Calculate current score
    const unusedCards = hand.filter(c => !usedCardIds.has(c.id));
    const points = unusedCards.reduce((sum, c) => sum + (c.isJoker ? 25 : c.points), 0);

    if (points < minUnmatchedPoints) {
      minUnmatchedPoints = points;
      bestMelds = [...currentMelds];
      bestUnmatchedCards = unusedCards;
    }

    if (index >= candidateMelds.length) return;

    for (let i = index; i < candidateMelds.length; i++) {
      const cand = candidateMelds[i];
      // Check if candidate cards overlap with used cards
      if (cand.cards.some(c => usedCardIds.has(c.id))) continue;

      // Select candidate
      const newUsed = new Set(usedCardIds);
      cand.cards.forEach(c => newUsed.add(c.id));

      const newMeld: Meld = {
        id: `meld_${i}_${Date.now()}`,
        type: cand.type,
        cards: cand.cards,
      };

      search(i + 1, [...currentMelds, newMeld], newUsed);
    }
  }

  search(0, [], new Set());

  const canClose = minUnmatchedPoints <= closeThreshold;
  const isCleanClose = minUnmatchedPoints === 0;

  return {
    melds: bestMelds,
    unmatchedCards: bestUnmatchedCards,
    unmatchedPoints: minUnmatchedPoints,
    canClose,
    isCleanClose,
    isChinchon: false,
  };
}

// Utility: Power set subsets generator for array of length minSize to maxSize
function getSubsets<T>(array: T[], minSize: number, maxSize: number): T[][] {
  const result: T[][] = [];

  function fork(index: number, current: T[]) {
    if (current.length >= minSize && current.length <= maxSize) {
      result.push([...current]);
    }
    if (current.length >= maxSize || index >= array.length) return;

    for (let i = index; i < array.length; i++) {
      current.push(array[i]);
      fork(i + 1, current);
      current.pop();
    }
  }

  fork(0, []);
  return result;
}
