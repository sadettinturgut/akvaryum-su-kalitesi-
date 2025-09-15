
export interface WaterQualityData {
  timestamp: number;
  temperature: number;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}

export type Parameter = 'temperature' | 'ph' | 'ammonia' | 'nitrite' | 'nitrate';

export enum StatusLevel {
  GÜVENLİ = 'GÜVENLİ',
  UYARI = 'UYARI',
  TEHLİKE = 'TEHLİKE',
}

export interface ParameterConfig {
  label: string;
  unit: string;
  getStatus: (value: number) => StatusLevel;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  recommendation: string;
}

export type View = 'dashboard' | 'information' | 'reports' | 'help' | 'settings';

export type Theme = 'light' | 'dark';
export type Language = 'tr' | 'en';


export interface Fish {
  name: string;
  species: string;
  description: string;
  imageUrl: string;
}

export type FilterCategory = 'Mekanik' | 'Biyolojik' | 'Kimyasal' | 'Ekstra';

export interface FilterMedium {
    id: string;
    name: string;
    category: FilterCategory;
    lastChanged: number;
    changeIntervalDays: number;
    consequence: string;
}

export interface AquariumSettings {
  volume: number; // in Liters
  filter: string;
  food: string;
  fish: Fish[];
  filterMedia: FilterMedium[];
}

export interface Report {
    id: string;
    timestamp: number;
    data: WaterQualityData;
    note?: string;
}
