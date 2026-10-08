import React from 'react';
import { motion } from 'motion/react';
import { GameSettings, Language, TableTheme } from '../types';
import { t } from '../lib/translations';
import { audioManager } from '../lib/audio';
import { Settings, Volume2, Music, Palette, Globe, Shield, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const THEMES: { id: TableTheme; labelKey: string; bgClass: string }[] = [
  { id: 'classic', labelKey: 'themeClassic', bgClass: 'bg-emerald-800' },
  { id: 'royal', labelKey: 'themeRoyal', bgClass: 'bg-sky-900' },
  { id: 'velvet', labelKey: 'themeVelvet', bgClass: 'bg-rose-900' },
  { id: 'midnight', labelKey: 'themeMidnight', bgClass: 'bg-slate-950' },
  { id: 'woodland', labelKey: 'themeWoodland', bgClass: 'bg-amber-950' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);

    if (key === 'sfxVolume' || key === 'ambientVolume') {
      audioManager.setVolumes(updated.sfxVolume, updated.ambientVolume);
    }
    if (key === 'ambientType') {
      audioManager.setAmbientSound(updated.ambientType);
    }
  };

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
            <Settings className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">{t(settings.language, 'settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-5 text-xs sm:text-sm">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              {t(settings.language, 'language')}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleChange('language', lang.code)}
                  className={`py-2 px-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                    settings.language === lang.code
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-bold'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Theme Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              {t(settings.language, 'tableTheme')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => handleChange('theme', th.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    settings.theme === th.id
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 ring-2 ring-amber-500/50'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border border-white/30 ${th.bgClass}`} />
                  <span className="text-xs font-semibold truncate">{t(settings.language, th.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Ambience Controls */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Music className="w-4 h-4" />
              {t(settings.language, 'soundSettings')}
            </h4>

            {/* SFX Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  {t(settings.language, 'sfxVolume')}
                </span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={e => handleChange('sfxVolume', parseFloat(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Ambient Sound Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t(settings.language, 'ambientSound')}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'fireside', key: 'ambientFireside' },
                  { id: 'rain', key: 'ambientRain' },
                  { id: 'lounge', key: 'ambientLounge' },
                  { id: 'breeze', key: 'ambientBreeze' },
                  { id: 'none', key: 'ambientNone' },
                ].map(amb => (
                  <button
                    key={amb.id}
                    onClick={() => handleChange('ambientType', amb.id as GameSettings['ambientType'])}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition border ${
                      settings.ambientType === amb.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {t(settings.language, amb.key)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gameplay Options */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              Reglas de la Partida
            </h4>

            {/* Max Points */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">{t(settings.language, 'maxPoints')}</span>
              <div className="flex gap-1">
                {[50, 100, 150].map(pts => (
                  <button
                    key={pts}
                    onClick={() => handleChange('maxPoints', pts)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.maxPoints === pts
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pts} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Jokers toggle */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">{t(settings.language, 'includeJokers')}</span>
              <button
                onClick={() => handleChange('includeJokers', !settings.includeJokers)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                  settings.includeJokers ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    settings.includeJokers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* AI Difficulty */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">{t(settings.language, 'aiDifficulty')}</span>
              <select
                value={settings.aiDifficulty}
                onChange={e => handleChange('aiDifficulty', e.target.value as GameSettings['aiDifficulty'])}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="easy">{t(settings.language, 'easy')}</option>
                <option value="normal">{t(settings.language, 'normal')}</option>
                <option value="pro">{t(settings.language, 'pro')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-md"
          >
            {t(settings.language, 'close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
