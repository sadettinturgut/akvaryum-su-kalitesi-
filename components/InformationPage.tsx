
import React, { useState, useEffect, useMemo } from 'react';
import { AquariumSettings, Fish } from '../types';
import BackButton from './common/BackButton';
import { TranslationFunction } from '../lib/localization';
import { TrashIcon, PlusCircleIcon } from './icons';

interface InformationPageProps {
  settings: AquariumSettings;
  onUpdateSettings: (newSettings: AquariumSettings) => void;
  onBack: () => void;
  t: TranslationFunction;
}

const InfoCard: React.FC<{label: string, value: React.ReactNode, unit?: string, subtext?: string}> = ({label, value, unit, subtext}) => (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow flex flex-col">
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                {value} <span className="text-base font-normal text-slate-600 dark:text-slate-300">{unit}</span>
            </p>
        </div>
        {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex-grow">{subtext}</p>}
    </div>
);


const FishCard: React.FC<{fish: Fish, isEditing: boolean, onDelete: () => void}> = ({fish, isEditing, onDelete}) => (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shadow flex flex-col sm:flex-row relative">
        {isEditing && (
            <button 
                onClick={onDelete}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 z-10 transition-colors"
                aria-label="Delete fish"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        )}
        <img src={fish.imageUrl} alt={fish.name} className="w-full sm:w-40 h-32 sm:h-auto object-cover"/>
        <div className="p-4 flex flex-col">
            <h4 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{fish.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-2">{fish.species}</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm flex-grow">{fish.description}</p>
        </div>
    </div>
);

const InformationPage: React.FC<InformationPageProps> = ({ settings, onUpdateSettings, onBack, t }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftSettings, setDraftSettings] = useState<AquariumSettings>(settings);

    useEffect(() => {
        setDraftSettings(settings);
    }, [settings]);

    const nextMaintenanceDate = useMemo(() => {
        if (!settings.filterMedia || settings.filterMedia.length === 0) {
            return null;
        }
        const nextDates = settings.filterMedia.map(m => m.lastChanged + m.changeIntervalDays * 24 * 60 * 60 * 1000);
        const soonestDate = Math.min(...nextDates);
        return new Date(soonestDate);
    }, [settings.filterMedia]);

    const handleSave = () => {
        onUpdateSettings(draftSettings);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraftSettings(settings);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDraftSettings(prev => ({ ...prev, [name]: name === 'volume' ? parseFloat(value) || 0 : value }));
    };

    const handleDeleteFish = (index: number) => {
        setDraftSettings(prev => ({
            ...prev,
            fish: prev.fish.filter((_, i) => i !== index)
        }));
    };

    const handleAddFish = () => {
        const newFish: Fish = { name: 'Yeni Balık', species: 'Tür', description: 'Açıklama', imageUrl: 'https://i.imgur.com/placehold.png' };
        setDraftSettings(prev => ({
            ...prev,
            fish: [...prev.fish, newFish]
        }));
    };
    
    const handleFishChange = (index: number, field: keyof Fish, value: string) => {
        setDraftSettings(prev => {
            const newFishList = [...prev.fish];
            newFishList[index] = { ...newFishList[index], [field]: value };
            return { ...prev, fish: newFishList };
        });
    };

    return (
        <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('information')}</h2>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-md transition-colors">{t('save')}</button>
                            <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-md transition-colors">{t('cancel')}</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-md transition-colors">{t('edit')}</button>
                    )}
                    <BackButton onClick={onBack} />
                </div>
            </div>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Genel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isEditing ? (
                        <>
                            <div><label className="text-sm text-slate-500 dark:text-slate-400">Akvaryum Hacmi (Litre)</label><input type="number" name="volume" value={draftSettings.volume} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                            <div><label className="text-sm text-slate-500 dark:text-slate-400">Filtre Modeli</label><input type="text" name="filter" value={draftSettings.filter} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                            <div><label className="text-sm text-slate-500 dark:text-slate-400">Kullanılan Yem</label><input type="text" name="food" value={draftSettings.food} onChange={handleChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                        </>
                    ) : (
                        <>
                            <InfoCard label="Akvaryum Hacmi" value={settings.volume} unit="Litre" />
                            <InfoCard 
                                label="Filtre Modeli" 
                                value={settings.filter} 
                                subtext={nextMaintenanceDate ? `Sonraki bakım: ${nextMaintenanceDate.toLocaleDateString('tr-TR')}` : 'Bakım bilgisi yok'}
                            />
                            <InfoCard label="Kullanılan Yem" value={settings.food} />
                        </>
                    )}
                </div>
            </section>

             <section>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Balık Listesi</h3>
                <div className="space-y-4">
                    {draftSettings.fish.map((fish, index) => 
                        isEditing ? (
                            <div key={index} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                               <button onClick={() => handleDeleteFish(index)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 z-10 transition-colors" aria-label={t('deleteFish')}><TrashIcon className="w-4 h-4" /></button>
                               <div><label className="text-sm text-slate-500 dark:text-slate-400">İsim</label><input type="text" value={fish.name} onChange={(e) => handleFishChange(index, 'name', e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                               <div><label className="text-sm text-slate-500 dark:text-slate-400">Tür</label><input type="text" value={fish.species} onChange={(e) => handleFishChange(index, 'species', e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                               <div><label className="text-sm text-slate-500 dark:text-slate-400">Resim URL</label><input type="text" value={fish.imageUrl} onChange={(e) => handleFishChange(index, 'imageUrl', e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" /></div>
                               <div><label className="text-sm text-slate-500 dark:text-slate-400">Açıklama</label><textarea value={fish.description} onChange={(e) => handleFishChange(index, 'description', e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" rows={2}></textarea></div>
                            </div>
                        ) : (
                            <FishCard key={index} fish={fish} isEditing={false} onDelete={() => {}} />
                        )
                    )}
                    {isEditing && (
                        <button onClick={handleAddFish} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-cyan-500 hover:text-cyan-500 transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                            {t('addFish')}
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default InformationPage;
