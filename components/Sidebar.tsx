
import React from 'react';
import { WaterQualityData, StatusLevel, Parameter, View } from '../types';
import AlarmCard from './AlarmCard';
import { PARAMETER_CONFIGS } from './Dashboard';
import { CheckCircleIcon, HomeIcon, SettingsIcon, FileTextIcon, HelpCircleIcon, InfoIcon } from './icons';
import { TranslationFunction } from '../lib/localization';
import TrackingModule from './TrackingModule';

interface SidebarProps {
  data: WaterQualityData;
  currentView: View;
  onNavigate: (view: View) => void;
  t: TranslationFunction;
  lastFeeding: number | null;
  onLogFeeding: () => void;
  onLogFilterMaintenance: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    data, 
    currentView, 
    onNavigate, 
    t,
    lastFeeding,
    onLogFeeding,
    onLogFilterMaintenance
 }) => {
  if (!data) {
    return null; // or a loading state
  }

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: HomeIcon },
    { id: 'information', label: t('information'), icon: InfoIcon },
    { id: 'reports', label: t('reports'), icon: FileTextIcon },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
    { id: 'help', label: t('help'), icon: HelpCircleIcon },
  ] as const;

  const alarms = (Object.keys(PARAMETER_CONFIGS) as Parameter[])
    .filter(key => PARAMETER_CONFIGS[key].getStatus(data[key]) === StatusLevel.TEHLİKE);

  return (
    <aside className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg sticky top-24 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t('controlPanel')}</h3>
        
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300">{t('activeAlarms')}</h4>
          {alarms.length > 0 ? (
            <div className="space-y-3">
              {alarms.map(paramKey => (
                <AlarmCard 
                  key={paramKey}
                  config={PARAMETER_CONFIGS[paramKey]}
                  value={data[paramKey]}
                />
              ))}
            </div>
          ) : (
            <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6" />
              <p className="text-sm font-medium">{t('allSafe')}</p>
            </div>
          )}
        </div>
      </div>
      
      <TrackingModule 
        t={t}
        lastFeeding={lastFeeding}
        onLogFeeding={onLogFeeding}
        onLogFilterMaintenance={onLogFilterMaintenance}
      />

      <div>
        <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-3">{t('menu')}</h4>
        <nav>
          <ul className="space-y-2">
            {menuItems.map(item => (
                 <li key={item.id}>
                 <a
                   href="#"
                   onClick={(e) => { e.preventDefault(); onNavigate(item.id as View); }}
                   className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${
                     currentView === item.id
                       ? 'font-semibold text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800'
                       : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                   }`}
                 >
                   <item.icon className="w-5 h-5" />
                   <span>{item.label}</span>
                 </a>
               </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
