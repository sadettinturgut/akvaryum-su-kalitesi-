import React, { useMemo } from 'react';
import { Report, Parameter } from '../types';
import BackButton from './common/BackButton';
import { PARAMETER_CONFIGS } from './Dashboard';
import { TranslationFunction } from '../lib/localization';

interface ReportsPageProps {
  reports: Report[];
  onAddReport: () => void;
  onBack: () => void;
  t: TranslationFunction;
}

const ReportItem: React.FC<{ report: Report; formattedDate: string }> = ({ report, formattedDate }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Rapor Zamanı: <span className="font-semibold text-slate-600 dark:text-slate-300">{formattedDate}</span>
                </p>
            </div>
             {report.note && (
                <div className="mb-3 p-3 bg-cyan-50 dark:bg-cyan-900/40 border-l-4 border-cyan-400 text-cyan-800 dark:text-cyan-200 rounded-r-md">
                    <p className="font-semibold text-sm">{report.note}</p>
                </div>
             )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
                {(Object.keys(PARAMETER_CONFIGS) as Parameter[]).map(key => (
                    <div key={key} className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{PARAMETER_CONFIGS[key].label}</p>
                        <p className="font-bold text-lg" style={{color: PARAMETER_CONFIGS[key].color.replace('text-', '')}}>
                            {report.data[key].toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReportsPage: React.FC<ReportsPageProps> = ({ reports, onAddReport, onBack, t }) => {
    const groupedAndFormattedReports = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const dayOfWeek = now.getDay(); // Sunday - 0, Monday - 1, ...
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
        const startOfWeek = new Date(now.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const groups: Record<string, { report: Report, formattedDate: string }[]> = {
            [t('reportsToday')]: [],
            [t('reportsThisWeek')]: [],
            [t('reportsThisMonth')]: [],
            [t('reportsOlder')]: [],
        };

        const sortedReports = [...reports].sort((a, b) => b.timestamp - a.timestamp);

        sortedReports.forEach(report => {
            const reportDate = new Date(report.timestamp);

            if (reportDate >= startOfToday) {
                groups[t('reportsToday')].push({
                    report,
                    formattedDate: reportDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                });
            } else if (reportDate >= startOfWeek) {
                 groups[t('reportsThisWeek')].push({
                    report,
                    formattedDate: reportDate.toLocaleString('tr-TR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })
                });
            } else if (reportDate >= startOfMonth) {
                 groups[t('reportsThisMonth')].push({
                    report,
                    formattedDate: reportDate.toLocaleDateString('tr-TR')
                });
            } else {
                 groups[t('reportsOlder')].push({
                    report,
                    formattedDate: reportDate.toLocaleDateString('tr-TR')
                });
            }
        });

        return groups;

    }, [reports, t]);

    const hasReports = reports.length > 0;

  return (
    <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('reports')}</h2>
            <BackButton onClick={onBack} />
        </div>

        <div className="mb-6">
            <button
                onClick={() => onAddReport()}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
            >
                Yeni Rapor Oluştur (Anlık Değerleri Kaydet)
            </button>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Kaydedilen Raporlar</h3>
            {hasReports ? (
                 <div className="space-y-8">
                    {Object.entries(groupedAndFormattedReports).map(([groupTitle, reportItems]) => {
                        if (reportItems.length === 0) return null;
                        return (
                            <section key={groupTitle}>
                                <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    {groupTitle}
                                </h4>
                                <div className="space-y-4">
                                    {reportItems.map(({ report, formattedDate }) => (
                                        <ReportItem key={report.id} report={report} formattedDate={formattedDate} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-10 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400">Henüz kaydedilmiş bir rapor bulunmuyor.</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Yukarıdaki butona tıklayarak veya Hızlı İşlemler menüsünden eylem kaydederek ilk raporunuzu oluşturun.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ReportsPage;