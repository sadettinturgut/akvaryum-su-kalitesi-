
import React from 'react';
import { ChevronLeftIcon } from '../icons';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-md transition-colors duration-200"
    >
      <ChevronLeftIcon className="w-4 h-4" />
      <span>Geri Dön</span>
    </button>
  );
};

export default BackButton;