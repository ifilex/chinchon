import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Card,
  GamePhase,
  GameSettings,
  PlayerStats,
  Achievement,
  RoundScore,
  HandAnalysis,
} from './types';
import {
  createDeck,
  shuffleDeck,
  sortCardsBySuit,
  sortCardsByRank,
  analyzeHand,
} from './lib/cards';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
  loadAchievements,
  saveAchievements,
} from './lib/storage';
import { evaluateAIDrawChoice, evaluateAIDiscardChoice } from './lib/ai';
import { audioManager } from './lib/audio';
import { TableBoard } from './components/TableBoard';
import { SpeedStatsModal } from './components/SpeedStatsModal';
import { RulesHelpModal } from './components/RulesHelpModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { Toast } from './components/Toast';

export default function App() {
  // Game Configuration & State
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<PlayerStats>(loadStats);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);

  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [roundScores, setRoundScores] = useState<RoundScore[]>([]);

  // Piles & Hands
  const [deck, setDeck] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Reaction Speed Timer
  const [turnStartTime, setTurnStartTime] = useState<number>(Date.now());
  const [turnTimerSec, setTurnTimerSec] = useState<number>(0);

  // Modals state
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);
  const [isScoreboardModalOpen, setIsScoreboardModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'achievement' | 'info' | 'success'>('info');

  const timerRef = useRef<number | null>(null);

  // Save settings, stats, achievements on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  // Turn timer interval
  useEffect(() => {
    if (gamePhase === 'player_draw' || gamePhase === 'player_discard') {
      timerRef.current = window.setInterval(() => {
        setTurnTimerSec((Date.now() - turnStartTime) / 1000);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTurnTimerSec(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, turnStartTime]);

  // Auto-start game on load if idle
  useEffect(() => {
    if (gamePhase === 'idle') {
      startNewGame();
    }
  }, []);

  const triggerToast = (msg: string, type: 'achievement' | 'info' | 'success' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === id && !a.unlocked) {
          audioManager.playAchievementUnlocked();
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });
          triggerToast('¡NUEVO LOGRO DESBLOQUEADO!', 'achievement');
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return a;
      });
      return updated;
    });
  };

  // Start new match
  const startNewGame = () => {
    setRoundNumber(1);
    setRoundScores([]);
    startNewRound(1, []);
  };

  // Start new round
  const startNewRound = (rNum: number, currentScores: RoundScore[]) => {
    const freshDeck = shuffleDeck(createDeck(settings.includeJokers));

    const pHand = freshDeck.slice(0, 7);
    const aHand = freshDeck.slice(7, 14);
    const initialDiscard = [freshDeck[14]];
    const remainingDeck = freshDeck.slice(15);

    setPlayerHand(settings.autoSortHand ? sortCardsBySuit(pHand) : pHand);
    setAiHand(aHand);
    setDiscardPile(initialDiscard);
    setDeck(remainingDeck);
    setSelectedCard(null);

    setGamePhase('player_draw');
    setTurnStartTime(Date.now());
  };

  // Track player decision speed
  const recordMoveSpeed = () => {
    const moveMs = Date.now() - turnStartTime;
    setStats(prev => {
      const newTurns = prev.turnsPlayed + 1;
      const newTotalMs = prev.totalTimeMs + moveMs;
      const isFast = moveMs < 2500;
      const newFastCount = prev.fastTurnsCount + (isFast ? 1 : 0);

      if (moveMs < 1500) {
        unlockAchievement('speed_demon');
      }

      return {
        ...prev,
        turnsPlayed: newTurns,
        totalTimeMs: newTotalMs,
        fastTurnsCount: newFastCount,
        averageTimeMs: Math.round(newTotalMs / newTurns),
      };
    });
  };

  // Player draws from deck
  const handleDrawDeck = () => {
    if (gamePhase !== 'player_draw' || deck.length === 0) return;

    recordMoveSpeed();
    audioManager.playCardSlide();

    const drawnCard = deck[deck.length - 1];
    const newDeck = deck.slice(0, -1);

    const updatedHand = [...playerHand, drawnCard];
    setDeck(newDeck);
    setPlayerHand(settings.autoSortHand ? sortCardsBySuit(updatedHand) : updatedHand);
    setSelectedCard(drawnCard);

    setGamePhase('player_discard');
  };

  // Player draws from discard pile
  const handleDrawDiscard = () => {
    if (gamePhase !== 'player_draw' || discardPile.length === 0) return;

    recordMoveSpeed();
    audioManager.playCardSlide();

    const drawnCard = discardPile[discardPile.length - 1];
    const newDiscard = discardPile.slice(0, -1);

    const updatedHand = [...playerHand, drawnCard];
    setDiscardPile(newDiscard);
    setPlayerHand(settings.autoSortHand ? sortCardsBySuit(updatedHand) : updatedHand);
    setSelectedCard(drawnCard);

    setGamePhase('player_discard');
  };

  // Player selects card in hand
  const handleSelectCard = (card: Card) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
      audioManager.playCardDrop();
    }
  };

  // Player discards card
  const handleDiscardCard = (cardToDiscard: Card) => {
    if (gamePhase !== 'player_discard') return;

    audioManager.playCardDrop();

    const updatedHand = playerHand.filter(c => c.id !== cardToDiscard.id);
    setPlayerHand(updatedHand);
    setDiscardPile(prev => [...prev, cardToDiscard]);
    setSelectedCard(null);

    setGamePhase('ai_thinking');

    // Trigger AI Turn with difficulty delay
    const delay = settings.aiDifficulty === 'easy' ? 1800 : settings.aiDifficulty === 'pro' ? 1000 : 1400;
    setTimeout(() => {
      executeAITurn(updatedHand, [...discardPile, cardToDiscard], deck);
    }, delay);
  };

  // Player closes hand
  const handleCloseHand = (cardToDiscard: Card) => {
    if (gamePhase !== 'player_discard') return;

    audioManager.playKnockSound();

    const remainingHand = playerHand.filter(c => c.id !== cardToDiscard.id);
    const pAnalysis = analyzeHand(remainingHand, settings.closeThreshold);
    const aAnalysis = analyzeHand(aiHand, settings.closeThreshold);

    finishRound('player', pAnalysis, aAnalysis);
  };

  // AI Turn Logic
  const executeAITurn = (
    currentPHand: Card[],
    currentDiscard: Card[],
    currentDeck: Card[]
  ) => {
    if (currentDeck.length === 0) {
      // Out of cards -> End round tie
      const pAnalysis = analyzeHand(currentPHand, settings.closeThreshold);
      const aAnalysis = analyzeHand(aiHand, settings.closeThreshold);
      finishRound('player', pAnalysis, aAnalysis);
      return;
    }

    // 1. AI Draw Choice
    const topDiscard = currentDiscard.length > 0 ? currentDiscard[currentDiscard.length - 1] : null;
    const drawChoice = evaluateAIDrawChoice(aiHand, topDiscard, settings);

    let updatedAiHand = [...aiHand];
    let updatedDeck = [...currentDeck];
    let updatedDiscard = [...currentDiscard];

    if (drawChoice === 'draw_discard' && topDiscard) {
      updatedAiHand.push(topDiscard);
      updatedDiscard.pop();
    } else {
      const drawn = updatedDeck.pop()!;
      updatedAiHand.push(drawn);
    }

    // 2. AI Discard & Close Choice
    const { cardToDiscard, shouldClose } = evaluateAIDiscardChoice(updatedAiHand, settings);

    if (shouldClose) {
      audioManager.playKnockSound();
      const finalAiHand = updatedAiHand.filter(c => c.id !== cardToDiscard.id);
      const aAnalysis = analyzeHand(finalAiHand, settings.closeThreshold);
      const pAnalysis = analyzeHand(currentPHand, settings.closeThreshold);
      finishRound('ai', pAnalysis, aAnalysis);
    } else {
      const finalAiHand = updatedAiHand.filter(c => c.id !== cardToDiscard.id);
      updatedDiscard.push(cardToDiscard);

      setAiHand(finalAiHand);
      setDeck(updatedDeck);
      setDiscardPile(updatedDiscard);

      setGamePhase('player_draw');
      setTurnStartTime(Date.now());
    }
  };

  // End Round & Calculate Scores
  const finishRound = (
    closedBy: 'player' | 'ai',
    pAnalysis: HandAnalysis,
    aAnalysis: HandAnalysis
  ) => {
    let pPts = pAnalysis.unmatchedPoints;
    let aPts = aAnalysis.unmatchedPoints;

    let notes = '';

    if (closedBy === 'player') {
      if (pAnalysis.isChinchon) {
        notes = '¡¡CHINCHÓN DE 7 CARTAS!! Victoria directa.';
        pPts = -25;
        unlockAchievement('chinchon_master');
      } else if (pAnalysis.isCleanClose) {
        notes = '¡Cierre limpio (0 pts)! Premio de -10 puntos.';
        pPts = -10;
        unlockAchievement('clean_close');
      }
    } else {
      if (aAnalysis.isChinchon) {
        notes = 'La IA hizo Chinchón.';
        aPts = -25;
      } else if (aAnalysis.isCleanClose) {
        notes = 'La IA hizo cierre limpio (-10 pts).';
        aPts = -10;
      }
    }

    const prevPlayerTotal = roundScores.length > 0 ? roundScores[roundScores.length - 1].playerTotal : 0;
    const prevAiTotal = roundScores.length > 0 ? roundScores[roundScores.length - 1].aiTotal : 0;

    const newPlayerTotal = Math.max(0, prevPlayerTotal + pPts);
    const newAiTotal = Math.max(0, prevAiTotal + aPts);

    const newScore: RoundScore = {
      roundNumber,
      playerPointsAdded: pPts,
      aiPointsAdded: aPts,
      playerTotal: newPlayerTotal,
      aiTotal: newAiTotal,
      closedBy,
      notes,
    };

    const updatedRoundScores = [...roundScores, newScore];
    setRoundScores(updatedRoundScores);

    // Check match finish conditions
    if (newPlayerTotal >= settings.maxPoints || newAiTotal >= settings.maxPoints || pAnalysis.isChinchon || aAnalysis.isChinchon) {
      setGamePhase('game_over');
      const isPlayerWinner = newPlayerTotal < newAiTotal || pAnalysis.isChinchon;

      setStats(prev => ({
        ...prev,
        wins: prev.wins + (isPlayerWinner ? 1 : 0),
        losses: prev.losses + (isPlayerWinner ? 0 : 1),
      }));

      if (isPlayerWinner) {
        audioManager.playVictoryFanfare();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
        unlockAchievement('first_win');
      }
    } else {
      setGamePhase('round_end');
    }
  };

  const playerAnalysis = analyzeHand(playerHand, settings.closeThreshold);
  const aiAnalysis = analyzeHand(aiHand, settings.closeThreshold);

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      <Toast message={toastMessage} type={toastType} />

      <TableBoard
        gamePhase={gamePhase}
        playerHand={playerHand}
        aiHand={aiHand}
        deckCount={deck.length}
        discardPile={discardPile}
        selectedCard={selectedCard}
        playerAnalysis={playerAnalysis}
        aiAnalysis={aiAnalysis}
        settings={settings}
        turnTimerSec={turnTimerSec}
        roundScores={roundScores}
        roundNumber={roundNumber}
        onDrawDeck={handleDrawDeck}
        onDrawDiscard={handleDrawDiscard}
        onSelectCard={handleSelectCard}
        onDiscardCard={handleDiscardCard}
        onCloseHand={handleCloseHand}
        onAutoSort={() => setPlayerHand(sortCardsBySuit(playerHand))}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSpeedStats={() => setIsSpeedModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsModalOpen(true)}
        onOpenScoreboard={() => setIsScoreboardModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onStartNewGame={startNewGame}
        onNextRound={() => {
          setRoundNumber(prev => prev + 1);
          startNewRound(roundNumber + 1, roundScores);
        }}
      />

      {/* Modals */}
      <SpeedStatsModal
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
        stats={stats}
        lang={settings.language}
        onResetStats={() => setStats({ ...stats, turnsPlayed: 0, totalTimeMs: 0, averageTimeMs: 0, fastTurnsCount: 0 })}
      />

      <RulesHelpModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        lang={settings.language}
        onReadRules={() => unlockAchievement('rules_scholar')}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={achievements}
        lang={settings.language}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <ScoreboardModal
        isOpen={isScoreboardModalOpen}
        onClose={() => setIsScoreboardModalOpen(false)}
        scores={roundScores}
        maxPoints={settings.maxPoints}
        lang={settings.language}
      />
    </main>
  );
}
