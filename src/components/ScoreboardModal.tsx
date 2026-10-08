import React from 'react';
import { motion } from 'motion/react';
import { RoundScore, Language } from '../types';
import { t } from '../lib/translations';
import { Award, Trophy, X } from 'lucide-react';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: RoundScore[];
  maxPoints: number;
  lang: Language;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  scores,
  maxPoints,
  lang,
}) => {
  if (!isOpen) return null;

  const currentRound = scores.length > 0 ? scores[scores.length - 1] : null;
  const playerTotal = currentRound ? currentRound.playerTotal : 0;
  const aiTotal = currentRound ? currentRound.aiTotal : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">{t(lang, 'scoreboard')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Total Standings */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/80 grid grid-cols-2 gap-4 text-center">
          <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block uppercase">Tú (Jugador)</span>
            <span className={`text-3xl font-black ${playerTotal >= maxPoints ? 'text-rose-400' : 'text-emerald-400'}`}>
              {playerTotal} <span className="text-xs text-slate-500 font-normal">/ {maxPoints}</span>
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block uppercase">IA (Don Mateo)</span>
            <span className={`text-3xl font-black ${aiTotal >= maxPoints ? 'text-rose-400' : 'text-amber-400'}`}>
              {aiTotal} <span className="text-xs text-slate-500 font-normal">/ {maxPoints}</span>
            </span>
          </div>
        </div>

        {/* Round History Table */}
        <div className="flex-1 overflow-y-auto pr-1 my-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Historial de Rondas:</h4>
          {scores.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Aún no se ha completado ninguna ronda.</p>
          ) : (
            <div className="space-y-1.5">
              {scores.map(s => (
                <div
                  key={s.roundNumber}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-700 font-bold flex items-center justify-center text-[10px] text-amber-300">
                      R{s.roundNumber}
                    </span>
                    <span className="text-slate-300 font-medium">
                      Cerró: <strong className="text-amber-400">{s.closedBy === 'player' ? 'Tú' : 'IA'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono font-bold">
                    <span className={s.playerPointsAdded <= 0 ? 'text-emerald-400' : 'text-slate-300'}>
                      {s.playerPointsAdded > 0 ? `+${s.playerPointsAdded}` : s.playerPointsAdded}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className={s.aiPointsAdded <= 0 ? 'text-emerald-400' : 'text-slate-300'}>
                      {s.aiPointsAdded > 0 ? `+${s.aiPointsAdded}` : s.aiPointsAdded}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
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
