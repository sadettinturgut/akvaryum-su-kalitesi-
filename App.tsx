
import React, { useState, useEffect, useCallback } from 'react';
import { WaterQualityData, Parameter, View, Theme, Language, AquariumSettings, Fish, Report, FilterMedium } from './types';
import { useLocalization } from './lib/localization';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HistoryChart from './components/HistoryChart';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import InformationPage from './components/InformationPage';
import ReportsPage from './components/ReportsPage';
import HelpPage from './components/HelpPage';
import SettingsPage from './components/SettingsPage';
import FilterMaintenanceModal from './components/FilterMaintenanceModal';

const MAX_HISTORY_LENGTH = 50;

const INITIAL_AQUARIUM_DATA: AquariumSettings = {
    volume: 120,
    filter: 'Eheim Classic 2213 Dış Filtre',
    food: 'Tetra Pro Colour & NLS Thera+A',
    fish: [
        {
            name: 'Neon Tetra',
            species: 'Paracheirodon innesi',
            description: 'Sürü halinde yaşamayı seven, barışçıl ve renkli bir balıktır. Akvaryuma canlılık katar.',
            imageUrl: 'https://i.imgur.com/8x215yT.jpeg',
        },
        {
            name: 'Cüce Vatoz (L144)',
            species: 'Ancistrus sp.',
            description: 'Akvaryum camlarını ve dekorları yosunlardan temizlemesiyle bilinir. Barışçıldır ve genellikle geceleri aktiftir.',
            imageUrl: 'https://i.imgur.com/O4VN3ZT.jpeg',
        },
        {
            name: 'Kribensis',
            species: 'Pelvicachromis pulcher',
            description: 'Canlı renklere sahip, özellikle üreme dönemlerinde oldukça renklenen bir cichlid türüdür. Kendi türüne karşı bölgeci olabilir.',
            imageUrl: 'https://i.imgur.com/b84MtNe.jpeg',
        },
         {
            name: 'Çöpçü Balığı',
            species: 'Corydoras aeneus',
            description: 'Akvaryum tabanındaki yem artıklarını temizleyerek su kalitesine katkıda bulunur. Sürü halinde bakılması gerekir.',
            imageUrl: 'https://i.imgur.com/k2K4gUf.jpeg',
        },
    ],
    filterMedia: [
        { id: 'sunger_ince', name: 'Sünger (İnce Gözenekli)', category: 'Mekanik', lastChanged: Date.now() - 10 * 24 * 60 * 60 * 1000, changeIntervalDays: 30, consequence: 'Tıkanarak su akışını ciddi şekilde yavaşlatabilir.' },
        { id: 'aktif_karbon', name: 'Aktif Karbon', category: 'Kimyasal', lastChanged: Date.now() - 40 * 24 * 60 * 60 * 1000, changeIntervalDays: 21, consequence: 'Su bulanıklaşabilir ve koku yapabilir.' },
        { id: 'seramik_halka', name: 'Seramik Halka', category: 'Biyolojik', lastChanged: Date.now() - 100 * 24 * 60 * 60 * 1000, changeIntervalDays: 180, consequence: 'Biyolojik filtrasyon kapasitesi düşer, amonyak ve nitrit birikebilir.' },
    ]
};

const generateInitialDataPoint = (): WaterQualityData => ({
  timestamp: new Date().getTime(),
  temperature: 25,
  ph: 7.2,
  ammonia: 0.1,
  nitrite: 0.05,
  nitrate: 10,
});

const generateNextDataPoint = (prevData: WaterQualityData): WaterQualityData => {
  const slightlyRandom = (value: number, range: number) => value + (Math.random() - 0.5) * range;

  // Sometimes spike a value to trigger alarm
  const shouldSpike = Math.random() < 0.05; 
  const spikedParam = ['ammonia', 'nitrite', 'temperature'][Math.floor(Math.random() * 3)];

  return {
    timestamp: new Date().getTime(),
    temperature: parseFloat(slightlyRandom(prevData.temperature, shouldSpike && spikedParam === 'temperature' ? 2 : 0.2).toFixed(2)),
    ph: parseFloat(slightlyRandom(prevData.ph, 0.1).toFixed(2)),
    ammonia: Math.max(0, parseFloat(slightlyRandom(prevData.ammonia, shouldSpike && spikedParam === 'ammonia' ? 0.6 : 0.05).toFixed(3))),
    nitrite: Math.max(0, parseFloat(slightlyRandom(prevData.nitrite, shouldSpike && spikedParam === 'nitrite' ? 0.6 : 0.02).toFixed(3))),
    nitrate: Math.max(0, parseFloat(slightlyRandom(prevData.nitrate, 1).toFixed(2))),
  };
};

const App: React.FC = () => {
  const [history, setHistory] = useState<WaterQualityData[]>([generateInitialDataPoint()]);
  const [selectedParameter, setSelectedParameter] = useState<Parameter>('temperature');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('tr');
  const t = useLocalization(language);

  // Lifted state
  const [aquariumSettings, setAquariumSettings] = useState<AquariumSettings>(INITIAL_AQUARIUM_DATA);
  const [reports, setReports] = useState<Report[]>([]);
  const [lastFeeding, setLastFeeding] = useState<number | null>(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prevHistory => {
        const nextPoint = generateNextDataPoint(prevHistory[prevHistory.length - 1]);
        const newHistory = [...prevHistory, nextPoint];
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          return newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
        }
        return newHistory;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const handleAddReport = useCallback((note?: string) => {
    const latestData = history[history.length - 1];
    if (latestData) {
        const newReport: Report = {
            id: `report-${Date.now()}`,
            timestamp: Date.now(),
            data: latestData,
            note: note,
        };
        setReports(prev => [newReport, ...prev]);
    }
  }, [history]);

  const handleLogFeeding = useCallback(() => {
    setLastFeeding(Date.now());
    handleAddReport(t('feedingLogged'));
  }, [handleAddReport, t]);

  const handleOpenMaintenanceModal = useCallback(() => {
    setIsMaintenanceModalOpen(true);
  }, []);

  const handleUpdateFilterMedium = useCallback((mediumId: string) => {
    setAquariumSettings(prevSettings => {
        const newMedia = prevSettings.filterMedia.map(medium => {
            if (medium.id === mediumId) {
                return { ...medium, lastChanged: Date.now() };
            }
            return medium;
        });
        const changedMedium = prevSettings.filterMedia.find(m => m.id === mediumId);
        if (changedMedium) {
             handleAddReport(`${changedMedium.name} ${t('filterMediumChanged')}`);
        }
        return { ...prevSettings, filterMedia: newMedia };
    });
  }, [handleAddReport, t]);

  const handleSaveChangesToFilterMedia = useCallback((updatedMedia: FilterMedium[]) => {
    setAquariumSettings(prev => ({
        ...prev,
        filterMedia: updatedMedia
    }));
  }, []);


  const handleSelectParameter = useCallback((param: Parameter) => {
    setSelectedParameter(param);
  }, []);
  
  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: AquariumSettings) => {
    setAquariumSettings(newSettings);
  }, []);

  const latestData = history[history.length - 1];

  const renderContent = () => {
    switch (currentView) {
      case 'information':
        return <InformationPage 
                    settings={aquariumSettings} 
                    onUpdateSettings={handleUpdateSettings}
                    onBack={() => handleNavigate('dashboard')} 
                    t={t}
                />;
      case 'reports':
        return <ReportsPage 
                    reports={reports}
                    onAddReport={handleAddReport}
                    onBack={() => handleNavigate('dashboard')} 
                    t={t}
                />;
      case 'help':
        return <HelpPage onBack={() => handleNavigate('dashboard')} />;
      case 'settings':
        return <SettingsPage onBack={() => handleNavigate('dashboard')} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} t={t} />;
      case 'dashboard':
      default:
        return (
          <div className="flex flex-col gap-8">
            {latestData && (
              <Dashboard 
                data={latestData} 
                onSelectParameter={handleSelectParameter}
                selectedParameter={selectedParameter}
              />
            )}
            <HistoryChart data={history} parameter={selectedParameter} />
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-white font-sans antialiased transition-colors duration-300">
      <Header t={t} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="w-full lg:flex-grow">
            {renderContent()}
          </main>

          {/* Sidebar */}
          {latestData && (
            <aside className="w-full lg:w-[380px] lg:flex-shrink-0">
              <Sidebar 
                data={latestData} 
                currentView={currentView}
                onNavigate={handleNavigate}
                t={t}
                lastFeeding={lastFeeding}
                onLogFeeding={handleLogFeeding}
                onLogFilterMaintenance={handleOpenMaintenanceModal}
              />
            </aside>
          )}
        </div>
      </div>
      <Footer />
      <FilterMaintenanceModal 
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        media={aquariumSettings.filterMedia}
        onUpdate={handleUpdateFilterMedium}
        onSave={handleSaveChangesToFilterMedia}
        t={t}
      />
    </div>
  );
};

export default App;
