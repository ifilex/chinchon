import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'achievement' | 'info' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className={`px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 font-bold text-xs sm:text-sm text-slate-100 ${
            type === 'achievement'
              ? 'bg-amber-950/90 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
              : 'bg-slate-900/90 border-slate-700 text-slate-100'
          }`}>
            {type === 'achievement' ? (
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            ) : (
              <Sparkles className="w-5 h-5 text-sky-400" />
            )}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
