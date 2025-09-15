
import React from 'react';
import { WaterQualityData, Parameter, StatusLevel, ParameterConfig } from '../types';
import ParameterCard from './ParameterCard';
import { TemperatureIcon, PHIcon, AmmoniaIcon, NitriteIcon, NitrateIcon } from './icons';

interface DashboardProps {
  data: WaterQualityData;
  onSelectParameter: (param: Parameter) => void;
  selectedParameter: Parameter;
}

export const PARAMETER_CONFIGS: Record<Parameter, ParameterConfig> = {
  temperature: {
    label: 'Sıcaklık',
    unit: '°C',
    getStatus: (v: number) => v >= 24 && v <= 27 ? StatusLevel.GÜVENLİ : (v < 22 || v > 29) ? StatusLevel.TEHLİKE : StatusLevel.UYARI,
    icon: TemperatureIcon,
    color: 'text-orange-400',
    recommendation: "Su ısıtıcısını kontrol edin veya soğutma için fan ekleyin. İdeal aralık 24-27°C'dir."
  },
  ph: {
    label: 'pH Seviyesi',
    unit: '',
    getStatus: (v: number) => v >= 6.8 && v <= 7.8 ? StatusLevel.GÜVENLİ : (v < 6.5 || v > 8.2) ? StatusLevel.TEHLİKE : StatusLevel.UYARI,
    icon: PHIcon,
    color: 'text-green-400',
    recommendation: "pH düşürücü/yükseltici solüsyonlar kullanın veya kısmi su değişimi yapın. Mangrove kökü pH'ı düşürebilir."
  },
  ammonia: {
    label: 'Amonyak (NH3)',
    unit: 'ppm',
    getStatus: (v: number) => v <= 0.25 ? StatusLevel.GÜVENLİ : v > 0.5 ? StatusLevel.TEHLİKE : StatusLevel.UYARI,
    icon: AmmoniaIcon,
    color: 'text-red-400',
    recommendation: "Hemen %25-50 oranında su değişimi yapın. Amonyak giderici ürünler kullanın ve yemlemeyi azaltın."
  },
  nitrite: {
    label: 'Nitrit (NO2)',
    unit: 'ppm',
    getStatus: (v: number) => v <= 0.25 ? StatusLevel.GÜVENLİ : v > 0.5 ? StatusLevel.TEHLİKE : StatusLevel.UYARI,
    icon: NitriteIcon,
    color: 'text-purple-400',
    recommendation: "Hemen %25-50 oranında su değişimi yapın. Akvaryum tuzu eklemek nitrit zehirlenmesini önleyebilir."
  },
  nitrate: {
    label: 'Nitrat (NO3)',
    unit: 'ppm',
    getStatus: (v: number) => v <= 20 ? StatusLevel.GÜVENLİ : v > 40 ? StatusLevel.TEHLİKE : StatusLevel.UYARI,
    icon: NitrateIcon,
    color: 'text-blue-400',
    recommendation: "Kısmi su değişimi yapın. Canlı bitki eklemek veya nitrat giderici filtre malzemeleri kullanmak yardımcı olur."
  },
};

const Dashboard: React.FC<DashboardProps> = ({ data, onSelectParameter, selectedParameter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      {(Object.keys(data) as Array<keyof WaterQualityData>)
        .filter(key => key !== 'timestamp')
        .map((key) => {
          const paramKey = key as Parameter;
          return (
            <ParameterCard
              key={paramKey}
              config={PARAMETER_CONFIGS[paramKey]}
              value={data[paramKey]}
              onClick={() => onSelectParameter(paramKey)}
              isSelected={selectedParameter === paramKey}
            />
          );
        })}
    </div>
  );
};

export default Dashboard;
