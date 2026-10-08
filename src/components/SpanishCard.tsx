import React from 'react';
import { motion } from 'motion/react';
import { Card, Suit } from '../types';
import { Coins, CupSoda, Swords, TreePine, Sparkles } from 'lucide-react';

interface SpanishCardProps {
  card: Card;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  size?: 'sm' | 'md' | 'lg';
  isMeldCard?: boolean;
}

export const SuitIcon: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-5 h-5' }) => {
  switch (suit) {
    case 'oros':
      return <Coins className={`${className} text-amber-500 fill-amber-400`} />;
    case 'copas':
      return <CupSoda className={`${className} text-rose-500 fill-rose-400`} />;
    case 'espadas':
      return <Swords className={`${className} text-sky-500 fill-sky-300`} />;
    case 'bastos':
      return <TreePine className={`${className} text-emerald-600 fill-emerald-500`} />;
    default:
      return null;
  }
};

export const getSuitColor = (suit: Suit) => {
  switch (suit) {
    case 'oros':
      return 'text-amber-700 dark:text-amber-300 border-amber-300 bg-amber-50/90 dark:bg-amber-950/40';
    case 'copas':
      return 'text-rose-700 dark:text-rose-300 border-rose-300 bg-rose-50/90 dark:bg-rose-950/40';
    case 'espadas':
      return 'text-sky-800 dark:text-sky-300 border-sky-300 bg-sky-50/90 dark:bg-sky-950/40';
    case 'bastos':
      return 'text-emerald-800 dark:text-emerald-300 border-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40';
  }
};

export const getRankDisplay = (num: number, isJoker?: boolean) => {
  if (isJoker) return '★';
  if (num === 1) return '1';
  if (num === 10) return '10'; // Sota
  if (num === 11) return '11'; // Caballo
  if (num === 12) return '12'; // Rey
  return num.toString();
};

export const getRankLabel = (num: number) => {
  if (num === 10) return 'Sota';
  if (num === 11) return 'Caballo';
  if (num === 12) return 'Rey';
  if (num === 1) return 'As';
  return num.toString();
};

export const SpanishCard: React.FC<SpanishCardProps> = ({
  card,
  faceDown = false,
  selected = false,
  onClick,
  disabled = false,
  badge,
  size = 'md',
  isMeldCard = false,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-18 text-xs',
    md: 'w-16 h-24 sm:w-20 sm:h-28 text-sm',
    lg: 'w-20 h-30 sm:w-24 sm:h-36 text-base',
  }[size];

  if (faceDown) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`${sizeClasses} relative rounded-xl border-2 border-amber-900/60 shadow-lg cursor-pointer transition-all overflow-hidden bg-gradient-to-br from-amber-900 via-amber-950 to-red-950 flex flex-col items-center justify-center p-1.5 border-dashed border-opacity-70`}
      >
        {/* Ornate back pattern */}
        <div className="absolute inset-1 rounded-lg border border-amber-600/40 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
        <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-amber-500/50 bg-amber-900/80 flex items-center justify-center shadow-inner">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  const rankText = getRankDisplay(card.number, card.isJoker);
  const colorClass = card.isJoker
    ? 'border-purple-300 bg-purple-50/90 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
    : getSuitColor(card.suit);

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: selected ? -14 : 0 }}
      whileHover={{ y: selected ? -18 : -6, scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      className={`
        ${sizeClasses}
        relative rounded-xl border-2 shadow-md cursor-pointer transition-all select-none
        flex flex-col justify-between p-1.5 sm:p-2 bg-white/95 dark:bg-slate-900/95
        ${colorClass}
        ${selected ? 'ring-4 ring-amber-400 shadow-amber-500/30 shadow-xl z-20 font-bold' : ''}
        ${isMeldCard ? 'ring-2 ring-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      {/* Top rank and suit */}
      <div className="flex items-center justify-between w-full font-black tracking-tighter leading-none">
        <span className="text-sm sm:text-base font-extrabold">{rankText}</span>
        {!card.isJoker && <SuitIcon suit={card.suit} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      </div>

      {/* Center illustration */}
      <div className="flex-1 flex flex-col items-center justify-center my-0.5">
        {card.isJoker ? (
          <div className="flex flex-col items-center text-purple-600">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">JOKER</span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <SuitIcon suit={card.suit} className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-sm" />
            <span className="absolute text-[10px] sm:text-xs font-bold opacity-80 bottom-[-14px]">
              {getRankLabel(card.number)}
            </span>
          </div>
        )}
      </div>

      {/* Bottom rank and suit (inverted) */}
      <div className="flex items-center justify-between w-full font-black leading-none rotate-180">
        <span className="text-sm sm:text-base font-extrabold">{rankText}</span>
        {!card.isJoker && <SuitIcon suit={card.suit} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      </div>

      {/* Badge if provided */}
      {badge && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-500 text-slate-950 shadow-md ring-2 ring-white">
          {badge}
        </span>
      )}
    </motion.div>
  );
};
