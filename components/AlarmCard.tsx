
import React from 'react';
import { ParameterConfig } from '../types';
import { AlertTriangleIcon } from './icons';

interface AlarmCardProps {
  config: ParameterConfig;
  value: number;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ config, value }) => {
  return (
    <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="bg-red-200 dark:bg-red-500/20 p-2 rounded-full mt-1">
            <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
            <h4 className="font-bold text-red-800 dark:text-red-300">{config.label} Seviyesi Tehlikeli!</h4>
            <p className="text-2xl font-mono text-slate-900 dark:text-white my-1">{value.toFixed(3)} {config.unit}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                <span className="font-semibold">Öneri:</span> {config.recommendation}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;