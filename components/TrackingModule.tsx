
import React from 'react';
import { TranslationFunction } from '../lib/localization';
import { ClockIcon, FilterIcon } from './icons';

interface TrackingModuleProps {
    t: TranslationFunction;
    lastFeeding: number | null;
    onLogFeeding: () => void;
    onLogFilterMaintenance: () => void;
}

const TrackingModule: React.FC<TrackingModuleProps> = ({ t, lastFeeding, onLogFeeding, onLogFilterMaintenance }) => {

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-3">{t('quickActions')}</h4>
            <div className="space-y-4">
                {/* Yemleme */}
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('lastFeeding')}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {lastFeeding ? new Date(lastFeeding).toLocaleString('tr-TR') : t('noFeedingLogged')}
                            </p>
                        </div>
                        <button onClick={onLogFeeding} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-2 shadow-md transition-colors">
                            <ClockIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* Filtre Bakımı */}
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('lastFilterMaintenance')}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                               Malzemelerin durumunu yönet
                            </p>
                        </div>
                         <button onClick={onLogFilterMaintenance} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-2 shadow-md transition-colors">
                            <FilterIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModule;
