
import React from 'react';
import BackButton from './common/BackButton';

const HelpPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Yardım Merkezi</h2>
                <BackButton onClick={onBack} />
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4">
                <h4>Pano</h4>
                <p>
                    Ana pano, akvaryumunuzun anlık su kalitesi değerlerini gösterir. Her bir parametre kartına tıklayarak o parametreye ait geçmiş verileri aşağıdaki grafikte görebilirsiniz. Sağ taraftaki "Kontrol Paneli"nde, değerler tehlikeli seviyeye ulaştığında otomatik olarak alarmlar ve çözüm önerileri belirir.
                </p>

                <h4>Bilgi</h4>
                <p>
                    Bu bölümde akvaryumunuzun hacmi, kullandığınız filtre ve yem gibi genel bilgileri ve akvaryumunuzda yaşayan balıkların listesini görüntüleyebilirsiniz. Bu bilgiler statiktir ve referans amaçlıdır.
                </p>
                
                <h4>Raporlar</h4>
                <p>
                   "Yeni Rapor Oluştur" butonuna tıklayarak o anki tüm su kalitesi değerlerini bir rapor olarak kaydedebilirsiniz. Bu, su değişimleri öncesi/sonrası gibi önemli anları kaydetmek veya belirli bir sorunun zaman içindeki seyrini izlemek için kullanışlıdır.
                </p>

                 <h4>Veri Akışı</h4>
                <p>
                   Bu uygulama, gerçek zamanlı sensör verilerini simüle eder. Değerler her 3 saniyede bir otomatik olarak güncellenir ve zaman zaman tehlikeli durumları canlandırmak için rastgele ani artışlar gösterebilir.
                </p>
            </div>
        </div>
    );
};

export default HelpPage;