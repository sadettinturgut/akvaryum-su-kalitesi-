
import React from 'react';
import { ParameterConfig, StatusLevel } from '../types';

interface ParameterCardProps {
  config: ParameterConfig;
  value: number;
  onClick: () => void;
  isSelected: boolean;
}

const statusStyles: { [key in StatusLevel]: { text: string; bg: string; dot: string } } = {
  [StatusLevel.GÜVENLİ]: { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10', dot: 'bg-green-500 dark:bg-green-400' },
  [StatusLevel.UYARI]: { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-500/10', dot: 'bg-yellow-500 dark:bg-yellow-400' },
  [StatusLevel.TEHLİKE]: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/10', dot: 'bg-red-500 dark:bg-red-400' },
};

const ParameterCard: React.FC<ParameterCardProps> = ({ config, value, onClick, isSelected }) => {
  const status = config.getStatus(value);
  const styles = statusStyles[status];
  const Icon = config.icon;

  const selectedClasses = isSelected ? 'ring-2 ring-cyan-500' : 'ring-1 ring-slate-200 dark:ring-slate-700';

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-850 p-4 rounded-lg shadow-md dark:shadow-lg cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1 ${selectedClasses}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{config.label}</p>
        <Icon className={`w-6 h-6 ${config.color}`} />
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value.toFixed(2)}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1.5">{config.unit}</span>
      </div>
      <div className={`flex items-center mt-3 p-1.5 rounded ${styles.bg}`}>
        <div className={`w-2.5 h-2.5 rounded-full mr-2 ${styles.dot}`}></div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${styles.text}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ParameterCard;