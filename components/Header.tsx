
import React from 'react';
import { FishIcon } from './icons';
import { TranslationFunction } from '../lib/localization';

interface HeaderProps {
  t: TranslationFunction;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-850/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <FishIcon className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {t('appTitle')}
            </h1>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;