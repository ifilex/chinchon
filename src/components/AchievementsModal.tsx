import React from 'react';
import { motion } from 'motion/react';
import { Achievement, Language } from '../types';
import { t } from '../lib/translations';
import { Trophy, CheckCircle2, Lock, X } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  lang: Language;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  lang,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">{t(lang, 'achievements')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Progreso Total:</span>
            <span className="text-amber-400">{unlockedCount} / {totalCount} ({pct}%)</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {achievements.map(ach => {
            const title = t(lang, ach.titleKey);
            const desc = t(lang, ach.descKey);

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border transition flex items-center gap-3 ${
                  ach.unlocked
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-slate-800/40 border-slate-800/60 opacity-70'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  ach.unlocked ? 'bg-amber-500/20 border border-amber-400/40' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-slate-100 truncate">{title}</h4>
                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t(lang, 'unlocked')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 shrink-0">
                        <Lock className="w-3.5 h-3.5" /> {t(lang, 'locked')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{desc}</p>

                  {/* Progress bar for incremental achievements */}
                  {ach.maxProgress && !ach.unlocked && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${Math.min(100, ((ach.progress || 0) / ach.maxProgress) * 100)}%` }}
                        />
                      </div>
                      <span>{ach.progress || 0}/{ach.maxProgress}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
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
