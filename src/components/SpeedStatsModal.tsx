import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats, Language } from '../types';
import { t } from '../lib/translations';
import { Zap, Timer, Brain, RotateCcw, X, Award } from 'lucide-react';

interface SpeedStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  lang: Language;
  onResetStats: () => void;
}

export const SpeedStatsModal: React.FC<SpeedStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  lang,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const avgSec = (stats.averageTimeMs / 1000).toFixed(2);
  const fastPct = stats.turnsPlayed > 0 
    ? Math.round((stats.fastTurnsCount / stats.turnsPlayed) * 100) 
    : 0;

  let speedCategory = t(lang, 'steady');
  if (stats.turnsPlayed > 0) {
    if (parseFloat(avgSec) <= 2.0) speedCategory = t(lang, 'lightning');
    else if (parseFloat(avgSec) <= 4.0) speedCategory = t(lang, 'fast');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">{t(lang, 'speedMetricsTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Tier Banner */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-800 to-amber-950/60 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{t(lang, 'speedRating')}</span>
            <div className="text-xl font-black text-amber-300 mt-0.5">{speedCategory}</div>
          </div>
          <Award className="w-10 h-10 text-amber-400 opacity-90 animate-bounce" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Timer className="w-4 h-4 text-sky-400" />
              <span>{t(lang, 'avgTimePerTurn')}</span>
            </div>
            <div className="text-2xl font-black text-sky-300">{avgSec}s</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{t(lang, 'fastTurnPercentage')}</span>
            </div>
            <div className="text-2xl font-black text-emerald-300">{fastPct}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>{t(lang, 'totalMoves')}</span>
            </div>
            <div className="text-2xl font-black text-purple-300">{stats.turnsPlayed}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Victorias / Derrotas</span>
            </div>
            <div className="text-2xl font-black text-amber-300">
              {stats.wins}W - {stats.losses}L
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onResetStats}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t(lang, 'resetStats')}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-md"
          >
            {t(lang, 'close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
