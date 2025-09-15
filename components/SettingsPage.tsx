
import React from 'react';
import { Theme, Language } from '../types';
import BackButton from './common/BackButton';
import { SunIcon, MoonIcon } from './icons';
import { TranslationFunction } from '../lib/localization';

interface SettingsPageProps {
  onBack: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationFunction;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, theme, setTheme, language, setLanguage, t }) => {
  return (
    <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('settings')}</h2>
        <BackButton onClick={onBack} />
      </div>

      <div className="space-y-8 max-w-md mx-auto">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t('theme')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">{t('themeDescription')}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 border-2 ${
                theme === 'light'
                  ? 'bg-cyan-500 border-cyan-500 text-white font-bold shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:border-cyan-500'
              }`}
            >
              <SunIcon className="w-5 h-5" />
              {t('lightTheme')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200 border-2 ${
                theme === 'dark'
                  ? 'bg-cyan-500 border-cyan-500 text-white font-bold shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:border-cyan-500'
              }`}
            >
              <MoonIcon className="w-5 h-5" />
              {t('darkTheme')}
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t('language')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">{t('languageDescription')}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('tr')}
              className={`flex-1 p-4 rounded-lg transition-all duration-200 border-2 ${
                language === 'tr'
                  ? 'bg-cyan-500 border-cyan-500 text-white font-bold shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:border-cyan-500'
              }`}
            >
              Türkçe
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 p-4 rounded-lg transition-all duration-200 border-2 ${
                language === 'en'
                  ? 'bg-cyan-500 border-cyan-500 text-white font-bold shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:border-cyan-500'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
