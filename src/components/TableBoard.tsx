import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Card,
  GamePhase,
  GameSettings,
  HandAnalysis,
  RoundScore,
  TableTheme,
} from '../types';
import { t } from '../lib/translations';
import { SpanishCard } from './SpanishCard';
import {
  Sparkles,
  Zap,
  BookOpen,
  Trophy,
  Settings,
  Layers,
  Flame,
  Award,
  BarChart2,
  RefreshCw,
  CheckCircle2,
  Bot,
  User,
  ArrowDownCircle,
} from 'lucide-react';

interface TableBoardProps {
  gamePhase: GamePhase;
  playerHand: Card[];
  aiHand: Card[];
  deckCount: number;
  discardPile: Card[];
  selectedCard: Card | null;
  playerAnalysis: HandAnalysis;
  aiAnalysis: HandAnalysis;
  settings: GameSettings;
  turnTimerSec: number;
  roundScores: RoundScore[];
  roundNumber: number;

  onDrawDeck: () => void;
  onDrawDiscard: () => void;
  onSelectCard: (card: Card) => void;
  onDiscardCard: (card: Card) => void;
  onCloseHand: (card: Card) => void;
  onAutoSort: () => void;

  onOpenRules: () => void;
  onOpenSpeedStats: () => void;
  onOpenAchievements: () => void;
  onOpenScoreboard: () => void;
  onOpenSettings: () => void;
  onStartNewGame: () => void;
  onNextRound: () => void;
}

export const TableBoard: React.FC<TableBoardProps> = ({
  gamePhase,
  playerHand,
  aiHand,
  deckCount,
  discardPile,
  selectedCard,
  playerAnalysis,
  aiAnalysis,
  settings,
  turnTimerSec,
  roundScores,
  roundNumber,
  onDrawDeck,
  onDrawDiscard,
  onSelectCard,
  onDiscardCard,
  onCloseHand,
  onAutoSort,
  onOpenRules,
  onOpenSpeedStats,
  onOpenAchievements,
  onOpenScoreboard,
  onOpenSettings,
  onStartNewGame,
  onNextRound,
}) => {
  const lang = settings.language;
  const topDiscard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  // Background style by theme
  const themeBackgrounds: Record<TableTheme, string> = {
    classic: 'from-emerald-900 via-emerald-950 to-slate-950 border-amber-900/50',
    royal: 'from-sky-950 via-indigo-950 to-slate-950 border-sky-800/50',
    velvet: 'from-rose-950 via-red-950 to-slate-950 border-rose-900/50',
    midnight: 'from-slate-900 via-slate-950 to-black border-slate-800',
    woodland: 'from-amber-950 via-amber-900 to-amber-950 border-amber-800',
  };

  const currentRoundScore = roundScores.length > 0 ? roundScores[roundScores.length - 1] : null;
  const playerTotalPts = currentRoundScore ? currentRoundScore.playerTotal : 0;
  const aiTotalPts = currentRoundScore ? currentRoundScore.aiTotal : 0;

  return (
    <div className={`w-full h-full min-h-screen bg-gradient-to-b ${themeBackgrounds[settings.theme]} text-slate-100 flex flex-col justify-between overflow-x-hidden select-none p-2 sm:p-4 transition-colors duration-500`}>
      {/* ================= HEADER NAVBAR ================= */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl z-30">
        {/* Title & Round */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            🎴
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-amber-300 leading-tight">
              {t(lang, 'appName')}
            </h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
              <span>{t(lang, 'round')} {roundNumber}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">Max {settings.maxPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tú:</span>
            <span className={`text-sm font-black ${playerTotalPts >= settings.maxPoints ? 'text-rose-400' : 'text-emerald-300'}`}>
              {playerTotalPts}
            </span>
          </div>
          <span className="text-slate-600">VS</span>
          <div className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>IA:</span>
            <span className={`text-sm font-black ${aiTotalPts >= settings.maxPoints ? 'text-rose-400' : 'text-amber-300'}`}>
              {aiTotalPts}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onOpenSpeedStats}
            title={t(lang, 'speedStats')}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-amber-400 transition"
          >
            <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            onClick={onOpenRules}
            title={t(lang, 'rulesHelp')}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-sky-400 transition"
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            onClick={onOpenAchievements}
            title={t(lang, 'achievements')}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-yellow-400 transition"
          >
            <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            onClick={onOpenScoreboard}
            title={t(lang, 'scoreboard')}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-emerald-400 transition"
          >
            <BarChart2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            onClick={onOpenSettings}
            title={t(lang, 'settings')}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition"
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </header>

      {/* ================= OPPONENT SECTION (AI) ================= */}
      <section className="relative my-2 sm:my-3 flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-bold text-amber-300 mb-2">
          <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Don Mateo (IA)</span>
          {gamePhase === 'ai_thinking' && (
            <span className="text-[10px] font-normal text-amber-400 animate-bounce">
              • {t(lang, 'aiTurn')}
            </span>
          )}
        </div>

        {/* AI Hand cards */}
        <div className="flex justify-center -space-x-4 sm:-space-x-6 max-w-full overflow-hidden p-2">
          {aiHand.map((card, idx) => (
            <SpanishCard
              key={card.id || idx}
              card={card}
              faceDown={gamePhase !== 'round_end' && gamePhase !== 'game_over'}
              size="sm"
            />
          ))}
        </div>
      </section>

      {/* ================= CENTRAL PLAYING MAT ================= */}
      <section className="relative my-auto py-4 px-2 sm:px-6 rounded-3xl bg-black/30 backdrop-blur-sm border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto w-full">
        {/* Status Prompt Banner */}
        <div className="w-full text-center">
          <AnimatePresence mode="wait">
            {gamePhase === 'player_draw' && (
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/10"
              >
                <ArrowDownCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{t(lang, 'yourTurn')}</span>
                <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full font-mono text-emerald-300">
                  ⏱️ {turnTimerSec.toFixed(1)}s
                </span>
              </motion.div>
            )}

            {gamePhase === 'player_discard' && (
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/10"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>{t(lang, 'yourTurnDiscard')}</span>
              </motion.div>
            )}

            {gamePhase === 'ai_thinking' && (
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold text-xs sm:text-sm"
              >
                <Bot className="w-4 h-4 text-purple-400 animate-spin" />
                <span>{t(lang, 'aiTurn')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Piles Row */}
        <div className="flex items-center justify-around w-full max-w-md gap-4 sm:gap-8">
          {/* Mazo (Draw Deck) */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Mazo ({deckCount})
            </span>
            <button
              onClick={onDrawDeck}
              disabled={gamePhase !== 'player_draw'}
              className={`relative rounded-xl transition-transform active:scale-95 ${
                gamePhase === 'player_draw'
                  ? 'hover:scale-105 ring-4 ring-emerald-400/60 shadow-xl cursor-pointer'
                  : 'opacity-80 cursor-not-allowed'
              }`}
            >
              <SpanishCard
                card={{ id: 'deck_back', suit: 'oros', number: 1, points: 0 }}
                faceDown={true}
                size="md"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg ring-2 ring-white">
                {deckCount}
              </span>
            </button>
            <button
              onClick={onDrawDeck}
              disabled={gamePhase !== 'player_draw'}
              className="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 disabled:opacity-40 transition shadow"
            >
              {t(lang, 'drawFromDeck')}
            </button>
          </div>

          {/* Pozo (Discard Pile) */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Pozo (Descartes)
            </span>
            <div className="relative">
              {topDiscard ? (
                <button
                  onClick={onDrawDiscard}
                  disabled={gamePhase !== 'player_draw'}
                  className={`rounded-xl transition-transform active:scale-95 ${
                    gamePhase === 'player_draw'
                      ? 'hover:scale-105 ring-4 ring-sky-400/60 shadow-xl cursor-pointer'
                      : ''
                  }`}
                >
                  <SpanishCard card={topDiscard} size="md" />
                </button>
              ) : (
                <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 border-dashed border-slate-700/60 bg-black/20 flex items-center justify-center text-xs text-slate-600">
                  Vacío
                </div>
              )}
            </div>
            <button
              onClick={onDrawDiscard}
              disabled={gamePhase !== 'player_draw' || !topDiscard}
              className="px-3 py-1 text-[11px] font-bold rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 disabled:opacity-40 transition shadow"
            >
              {t(lang, 'drawFromDiscard')}
            </button>
          </div>
        </div>

        {/* Selected Card Discard/Close Action Controls */}
        <AnimatePresence>
          {gamePhase === 'player_discard' && selectedCard && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border border-amber-500/40 backdrop-blur-md shadow-2xl"
            >
              <button
                onClick={() => onDiscardCard(selectedCard)}
                className="px-4 py-2 font-black text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition shadow-lg flex items-center gap-1.5"
              >
                <span>{t(lang, 'discard')}</span>
                <span className="font-mono text-[10px] opacity-80">({selectedCard.number})</span>
              </button>

              {playerAnalysis.canClose && (
                <button
                  onClick={() => onCloseHand(selectedCard)}
                  className="px-5 py-2 font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-xl transition shadow-lg ring-2 ring-amber-300 animate-bounce flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t(lang, 'closeHand')}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ================= PLAYER HAND SECTION ================= */}
      <section className="relative my-2 sm:my-3 flex flex-col items-center">
        {/* Player Status Badge & Controls */}
        <div className="flex items-center justify-between w-full max-w-2xl px-2 mb-2 text-xs">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-emerald-300">Tú</span>
            <span className="text-slate-500">|</span>
            <span className="font-bold text-slate-200">
              {t(lang, 'handScore')}:
              <strong className={`ml-1 font-black ${playerAnalysis.unmatchedPoints <= settings.closeThreshold ? 'text-emerald-400' : 'text-amber-400'}`}>
                {playerAnalysis.unmatchedPoints} {t(lang, 'pts')}
              </strong>
            </span>
          </div>

          <button
            onClick={onAutoSort}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-xs font-bold transition shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t(lang, 'autoSort')}</span>
          </button>
        </div>

        {/* Player Cards Fan */}
        <div className="flex justify-center -space-x-2 sm:-space-x-4 max-w-full overflow-x-auto p-3 py-4">
          {playerHand.map(card => {
            const isSelected = selectedCard?.id === card.id;
            const isMeld = playerAnalysis.melds.some(m => m.cards.some(c => c.id === card.id));

            return (
              <SpanishCard
                key={card.id}
                card={card}
                selected={isSelected}
                isMeldCard={isMeld}
                onClick={() => onSelectCard(card)}
              />
            );
          })}
        </div>
      </section>

      {/* ================= ROUND END OVERLAY MODAL ================= */}
      <AnimatePresence>
        {(gamePhase === 'round_end' || gamePhase === 'game_over') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-3 text-3xl">
                {gamePhase === 'game_over' ? '🏆' : '🎴'}
              </div>

              <h2 className="text-2xl font-black text-amber-300">
                {gamePhase === 'game_over'
                  ? (playerTotalPts < aiTotalPts ? t(lang, 'youWin') : t(lang, 'aiWins'))
                  : t(lang, 'roundResults')}
              </h2>

              <p className="text-xs text-slate-400 mt-1 mb-4">
                {currentRoundScore?.notes || `Ronda ${roundNumber} finalizada.`}
              </p>

              {/* Hand Analysis Breakdown */}
              <div className="grid grid-cols-2 gap-3 my-4 text-left">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Tú (Jugador)</span>
                  <div className="text-sm font-bold text-slate-200">
                    Puntos sueltos: <span className="text-emerald-400 font-black">{playerAnalysis.unmatchedPoints}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Combinaciones: {playerAnalysis.melds.length}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">IA (Don Mateo)</span>
                  <div className="text-sm font-bold text-slate-200">
                    Puntos sueltos: <span className="text-amber-400 font-black">{aiAnalysis.unmatchedPoints}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Combinaciones: {aiAnalysis.melds.length}
                  </div>
                </div>
              </div>

              {/* Next Round or New Game Button */}
              <div className="flex justify-center gap-3 mt-6">
                {gamePhase === 'game_over' ? (
                  <button
                    onClick={onStartNewGame}
                    className="px-6 py-3 text-base font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-2xl transition shadow-xl hover:scale-105 active:scale-95"
                  >
                    {t(lang, 'newGame')}
                  </button>
                ) : (
                  <button
                    onClick={onNextRound}
                    className="px-6 py-3 text-base font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl transition shadow-xl hover:scale-105 active:scale-95"
                  >
                    {t(lang, 'nextRound')}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
