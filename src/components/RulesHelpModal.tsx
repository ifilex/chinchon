import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language, Card } from '../types';
import { t } from '../lib/translations';
import { createDeck, analyzeHand } from '../lib/cards';
import { SpanishCard } from './SpanishCard';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, X, Layers, Flame } from 'lucide-react';

interface RulesHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onReadRules?: () => void;
}

export const RulesHelpModal: React.FC<RulesHelpModalProps> = ({
  isOpen,
  onClose,
  lang,
  onReadRules,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'tester'>('rules');

  // Interactive tester cards
  const [sampleDeck] = useState<Card[]>(() => createDeck(true));
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  if (!isOpen) return null;

  const toggleSelectCard = (card: Card) => {
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < 7) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const testerAnalysis = analyzeHand(selectedCards, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">{t(lang, 'rulesHelp')}</h2>
          </div>
          <button
            onClick={() => {
              if (onReadRules) onReadRules();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 my-4 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('rules');
              if (onReadRules) onReadRules();
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t(lang, 'howToPlayTitle')}
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              activeTab === 'tester'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t(lang, 'testMeldsTitle')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm text-slate-300">
          {activeTab === 'rules' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="leading-relaxed">{t(lang, 'chinchonRulesOverview')}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4" />
                  {t(lang, 'ruleMelds')}
                </h3>
                <ul className="space-y-2 pl-2">
                  <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                    {t(lang, 'ruleTrio')}
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                    {t(lang, 'ruleRun')}
                  </li>
                  <li className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 font-semibold flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t(lang, 'ruleChinchon')}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <Flame className="w-4 h-4" />
                  {t(lang, 'ruleClosing')}
                </h3>
                <p className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 leading-relaxed">
                  {t(lang, 'ruleClosingDesc')}
                </p>
              </div>

              {/* Point Values breakdown */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-2">Valor de las cartas (Puntos sueltos):</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-400">As (1)</span> = 1 pt
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-sky-400">2 a 7</span> = 2-7 pts
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400">10, 11, 12</span> = 10 pts
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-bold text-purple-400">Comodín</span> = 25 pts
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-400">{t(lang, 'select7Cards')}</p>

              {/* Selected Cards Deck display */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[110px] flex items-center justify-center gap-2 flex-wrap">
                {selectedCards.length === 0 ? (
                  <span className="text-slate-600 text-xs">Selecciona cartas de la baraja de abajo...</span>
                ) : (
                  selectedCards.map(card => (
                    <SpanishCard
                      key={card.id}
                      card={card}
                      size="sm"
                      onClick={() => toggleSelectCard(card)}
                    />
                  ))
                )}
              </div>

              {/* Results box */}
              {selectedCards.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Puntos no combinados:</span>
                    <span className={`text-lg font-black ${testerAnalysis.unmatchedPoints <= 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {testerAnalysis.unmatchedPoints} {t(lang, 'pts')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {testerAnalysis.isChinchon ? (
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Sparkles className="w-4 h-4" /> ¡CHINCHÓN DETECTADO!
                      </span>
                    ) : testerAnalysis.canClose ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> ¡Puedes CERRAR la mano!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <AlertCircle className="w-4 h-4" /> Demasiados puntos sueltos para cerrar (&gt; 5 pts)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Card Picker selector */}
              <div>
                <h4 className="font-bold text-slate-300 text-xs mb-2">Baraja de muestra:</h4>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  {sampleDeck.map(card => {
                    const isSelected = selectedCards.some(c => c.id === card.id);
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleSelectCard(card)}
                        className={`p-1 text-center rounded border cursor-pointer text-xs font-bold transition ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {card.isJoker ? '★' : `${card.number} ${card.suit[0].toUpperCase()}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer button */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              if (onReadRules) onReadRules();
              onClose();
            }}
            aria-label={t(lang, 'close')}
            className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-md"
          >
            {t(lang, 'close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
