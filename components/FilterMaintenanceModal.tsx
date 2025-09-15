
import React, { useState, useEffect, useMemo } from 'react';
import { FilterMedium } from '../types';
import { TranslationFunction } from '../lib/localization';
import { WrenchIcon, AlertTriangleIcon, CheckCircleIcon, TrashIcon, PlusCircleIcon } from './icons';
import { filterMediaLibrary } from '../lib/filterMediaData';

interface FilterMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: FilterMedium[];
  onUpdate: (mediumId: string) => void;
  onSave: (updatedMedia: FilterMedium[]) => void;
  t: TranslationFunction;
}

type Status = 'good' | 'soon' | 'overdue';

const getStatus = (medium: FilterMedium): { status: Status, daysLeft: number } => {
    const now = new Date().getTime();
    const nextChangeDate = medium.lastChanged + (medium.changeIntervalDays * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((nextChangeDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) return { status: 'overdue', daysLeft };
    if (daysLeft <= 7) return { status: 'soon', daysLeft };
    return { status: 'good', daysLeft };
};

const statusConfig: Record<Status, { labelKey: Parameters<TranslationFunction>[0], icon: React.FC<{className?: string}>, color: string, ringColor: string }> = {
    good: { labelKey: 'statusGood', icon: CheckCircleIcon, color: 'text-green-500', ringColor: 'ring-green-500/20' },
    soon: { labelKey: 'statusSoon', icon: AlertTriangleIcon, color: 'text-yellow-500', ringColor: 'ring-yellow-500/20' },
    overdue: { labelKey: 'statusOverdue', icon: AlertTriangleIcon, color: 'text-red-500', ringColor: 'ring-red-500/20' }
};

const toInputDateString = (timestamp: number) => {
    const date = new Date(timestamp);
    const tzoffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().split('T')[0];
    return localISOTime;
};

const FilterMaintenanceModal: React.FC<FilterMaintenanceModalProps> = ({ isOpen, onClose, media, onUpdate, onSave, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftMedia, setDraftMedia] = useState<FilterMedium[]>([]);
  const [selectedNewMedium, setSelectedNewMedium] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraftMedia(JSON.parse(JSON.stringify(media)));
      setIsEditing(false); // Reset editing state on open
    }
  }, [isOpen, media]);

  const availableMediaToAdd = useMemo(() => {
      const currentMediaIds = new Set(draftMedia.map(m => m.id));
      return filterMediaLibrary.filter(m => !currentMediaIds.has(m.id));
  }, [draftMedia]);

  const groupedAvailableMedia = useMemo(() => {
    return availableMediaToAdd.reduce((acc, medium) => {
        (acc[medium.category] = acc[medium.category] || []).push(medium);
        return acc;
    }, {} as Record<string, typeof availableMediaToAdd>);
  }, [availableMediaToAdd]);

  if (!isOpen) return null;

  const handleFieldChange = (id: string, field: 'lastChanged' | 'changeIntervalDays', value: string) => {
      setDraftMedia(currentDraft =>
          currentDraft.map(medium => {
              if (medium.id === id) {
                  const updatedValue = field === 'lastChanged'
                      ? new Date(value).getTime()
                      : Number(value);
                  return { ...medium, [field]: updatedValue };
              }
              return medium;
          })
      );
  };

  const handleDeleteMedium = (id: string) => {
    setDraftMedia(currentDraft => currentDraft.filter(m => m.id !== id));
  };
  
  const handleAddMedium = () => {
    if (!selectedNewMedium) return;
    const mediumToAdd = filterMediaLibrary.find(m => m.id === selectedNewMedium);
    if (mediumToAdd) {
        const newMedium: FilterMedium = {
            ...mediumToAdd,
            lastChanged: Date.now()
        };
        setDraftMedia(current => [...current, newMedium]);
        setSelectedNewMedium('');
    }
  };

  const handleSave = () => {
    onSave(draftMedia);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftMedia(media);
    setIsEditing(false);
  };

  const mediaSource = isEditing ? draftMedia : media;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-850 w-full max-w-2xl rounded-xl shadow-2xl p-6 transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('filterMaintenance')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-3xl leading-none">&times;</button>
        </div>

        <div className="space-y-4 flex-grow overflow-y-auto pr-2 -mr-2">
            {mediaSource.map((medium) => {
                const { status } = getStatus(medium);
                const config = statusConfig[status];
                const StatusIcon = config.icon;
                const nextChangeDate = new Date(medium.lastChanged + medium.changeIntervalDays * 24 * 60 * 60 * 1000);

                return (
                    <div key={medium.id} className={`bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg ring-2 ${config.ringColor} relative`}>
                        {isEditing && (
                             <button 
                                onClick={() => handleDeleteMedium(medium.id)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 z-10 transition-colors"
                                aria-label="Delete medium"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-grow">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{medium.name}</h4>
                                {isEditing ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('lastChanged')}</label>
                                            <input 
                                                type="date" 
                                                value={toInputDateString(medium.lastChanged)}
                                                onChange={(e) => handleFieldChange(medium.id, 'lastChanged', e.target.value)}
                                                className="w-full mt-1 p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('changeIntervalDaysLabel')}</label>
                                            <input 
                                                type="number" 
                                                value={medium.changeIntervalDays}
                                                onChange={(e) => handleFieldChange(medium.id, 'changeIntervalDays', e.target.value)}
                                                className="w-full mt-1 p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-slate-600 dark:text-slate-400">
                                        <span className="font-semibold">{t('lastChanged')}:</span>
                                        <span>{new Date(medium.lastChanged).toLocaleDateString('tr-TR')}</span>
                                        <span className="font-semibold">{t('nextChange')}:</span>
                                        <span>{nextChangeDate.toLocaleDateString('tr-TR')}</span>
                                    </div>
                                )}
                                {status !== 'good' && (
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                                        <span className="font-semibold">{t('consequence')}:</span> {medium.consequence}
                                    </p>
                                )}
                            </div>
                            <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:w-48 flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-md">
                               <div className="text-center">
                                    <p className={`text-xs font-semibold uppercase ${config.color}`}>{t('status')}</p>
                                    <div className={`flex items-center gap-2 font-bold ${config.color}`}>
                                        <StatusIcon className="w-5 h-5" />
                                        <span>{t(config.labelKey)}</span>
                                    </div>
                               </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => onUpdate(medium.id)}
                                        className="flex items-center gap-2 w-full justify-center px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-md transition-colors shadow"
                                    >
                                        <WrenchIcon className="w-4 h-4" />
                                        <span>{t('markAsChanged')}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {isEditing && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mt-4">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('addNewMedium')}</h5>
                    <div className="flex gap-2">
                        <select 
                            value={selectedNewMedium}
                            onChange={(e) => setSelectedNewMedium(e.target.value)}
                            className="flex-grow p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                        >
                            <option value="">{t('selectMediumToAdd')}</option>
                            {Object.entries(groupedAvailableMedia).map(([category, mediaList]) => (
                                <optgroup key={category} label={t(`category${category}` as any)}>
                                    {mediaList.map(medium => (
                                        <option key={medium.id} value={medium.id}>{medium.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddMedium} 
                            disabled={!selectedNewMedium}
                            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                             <PlusCircleIcon className="w-5 h-5"/>
                             <span>{t('add')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
        <div className="flex-shrink-0 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-md transition-colors">{t('cancel')}</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-md transition-colors">{t('save')}</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-md transition-colors">{t('edit')}</button>
              <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-md transition-colors">{t('close')}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterMaintenanceModal;
