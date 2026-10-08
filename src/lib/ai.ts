import { Card, GameSettings } from '../types';

import { analyzeHand, getCardPoints } from './cards';

export interface AIDecision {
  action: 'draw_deck' | 'draw_discard';
  cardToDiscard?: Card;
  shouldClose: boolean;
  reason?: string;
}

export function evaluateAIDrawChoice(
  aiHand: Card[],
  topDiscardCard: Card | null,
  settings: GameSettings
): 'draw_deck' | 'draw_discard' {
  if (!topDiscardCard) return 'draw_deck';

  // Current unmatched points without discard card
  const currentAnalysis = analyzeHand(aiHand, settings.closeThreshold);

  // Analyze hand with top discard card added
  const handWithDiscard = [...aiHand, topDiscardCard];
  
  // Try all possible discards from handWithDiscard
  let bestPointsWithDiscard = Infinity;
  for (let i = 0; i < handWithDiscard.length; i++) {
    const candidateHand = handWithDiscard.filter((_, idx) => idx !== i);
    const analysis = analyzeHand(candidateHand, settings.closeThreshold);
    if (analysis.unmatchedPoints < bestPointsWithDiscard) {
      bestPointsWithDiscard = analysis.unmatchedPoints;
    }
  }

  // If adding discard card strictly improves unmatched points, draw from discard
  if (bestPointsWithDiscard < currentAnalysis.unmatchedPoints) {
    return 'draw_discard';
  }

  // In Pro/Master difficulty, if discard card is a Joker, ALWAYS draw it!
  if (topDiscardCard.isJoker) {
    return 'draw_discard';
  }

  return 'draw_deck';
}

export function evaluateAIDiscardChoice(
  aiHand: Card[], // 8 cards (after drawing)
  settings: GameSettings
): { cardToDiscard: Card; shouldClose: boolean } {
  let bestDiscardCard: Card = aiHand[0];
  let minUnmatchedPoints = Infinity;
  let canCloseWithBest = false;

  // Evaluate each card as candidate discard
  for (let i = 0; i < aiHand.length; i++) {
    const candidateDiscard = aiHand[i];
    const remainingHand = aiHand.filter((_, idx) => idx !== i);

    const analysis = analyzeHand(remainingHand, settings.closeThreshold);

    if (
      analysis.unmatchedPoints < minUnmatchedPoints ||
      (analysis.unmatchedPoints === minUnmatchedPoints &&
        getCardPoints(candidateDiscard.number, candidateDiscard.isJoker) >
          getCardPoints(bestDiscardCard.number, bestDiscardCard.isJoker))
    ) {
      minUnmatchedPoints = analysis.unmatchedPoints;
      bestDiscardCard = candidateDiscard;
      canCloseWithBest = analysis.canClose;
    }
  }

  // Easy mode 15% random variance
  if (settings.aiDifficulty === 'easy' && Math.random() < 0.15 && aiHand.length > 0) {
    const randomIndex = Math.floor(Math.random() * aiHand.length);
    bestDiscardCard = aiHand[randomIndex];
    const remainingHand = aiHand.filter((_, idx) => idx !== randomIndex);
    const analysis = analyzeHand(remainingHand, settings.closeThreshold);
    canCloseWithBest = analysis.canClose;
  }

  return {
    cardToDiscard: bestDiscardCard,
    shouldClose: canCloseWithBest,
  };
}
