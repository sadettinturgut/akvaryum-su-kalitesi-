import { FilterMedium, FilterCategory } from '../types';

// This is a library of common filter media. 
// The `lastChanged` property will be set to Date.now() when a new item is added.
type LibraryFilterMedium = Omit<FilterMedium, 'lastChanged'>;

export const filterMediaLibrary: LibraryFilterMedium[] = [
    // Mekanik Filtre Malzemeleri
    { 
        id: 'elyaf', 
        name: 'Elyaf / Perlon Pamuk', 
        category: 'Mekanik', 
        changeIntervalDays: 7, 
        consequence: 'Su akışı yavaşlar, tıkanmalar başlar ve su bulanıklaşır.' 
    },
    { 
        id: 'sunger_kalin', 
        name: 'Sünger (Kalın Gözenekli)', 
        category: 'Mekanik', 
        changeIntervalDays: 30, 
        consequence: 'Büyük partikülleri tutma kapasitesi azalır, biyolojik yük artar.' 
    },
    { 
        id: 'sunger_ince', 
        name: 'Sünger (İnce Gözenekli)', 
        category: 'Mekanik', 
        changeIntervalDays: 30, 
        consequence: 'Tıkanarak su akışını ciddi şekilde yavaşlatabilir.' 
    },
    { 
        id: 'makaroni_seramik', 
        name: 'Makaroni Seramik', 
        category: 'Mekanik', 
        changeIntervalDays: 365, 
        consequence: 'Gözenekleri tıkanır, mekanik ve biyolojik filtrasyon verimi düşer.' 
    },
    { 
        id: 'firca_filtre', 
        name: 'Fırça Filtre', 
        category: 'Mekanik', 
        changeIntervalDays: 730, 
        consequence: 'Büyük atıkları tutamaz, sistemin geri kalanına yük biner. Periyodik temizlik gerektirir.' 
    },
    { 
        id: 'filtre_pedi', 
        name: 'Filtre Pedi (Elofiber)', 
        category: 'Mekanik', 
        changeIntervalDays: 14, 
        consequence: 'Tıkanır ve su akışını engeller, su kalitesini düşürür.' 
    },
    
    // Biyolojik Filtre Malzemeleri
    { 
        id: 'seramik_halka', 
        name: 'Seramik Halka (Ring)', 
        category: 'Biyolojik', 
        changeIntervalDays: 180, 
        consequence: 'Biyolojik filtrasyon kapasitesi düşer, amonyak ve nitrit birikebilir.' 
    },
    { 
        id: 'sinterlenmis_cam', 
        name: 'Sinterlenmiş Cam (Substrat Pro, Matrix)', 
        category: 'Biyolojik', 
        changeIntervalDays: 365, 
        consequence: 'Gözenekleri tıkanır ve bakteri kolonisi için yüzey alanı azalır.' 
    },
    { 
        id: 'bio_ball', 
        name: 'Bio-ball', 
        category: 'Biyolojik', 
        changeIntervalDays: 730, 
        consequence: 'Yüzeyde biriken organik atıklar bakteri aktivitesini yavaşlatır.' 
    },
    { 
        id: 'lav_tasi', 
        name: 'Lav Taşı', 
        category: 'Biyolojik', 
        changeIntervalDays: 365, 
        consequence: 'Gözenekleri tıkanarak yararlı bakteri tutma kapasitesini kaybeder.' 
    },
    { 
        id: 'biyolojik_sunger', 
        name: 'Biyolojik Sünger', 
        category: 'Biyolojik', 
        changeIntervalDays: 180, 
        consequence: 'Gözenekleri tıkanır, bakteri kolonisi için yüzey alanı ve verim azalır.' 
    },
    { 
        id: 'marinepure_block', 
        name: 'Kaldırılmış Biyolojik Taş (MarinePure)', 
        category: 'Biyolojik', 
        changeIntervalDays: 730, 
        consequence: 'Yüzeyde biyofilm tabakası kalınlaşır, verimliliği düşer.' 
    },

    // Kimyasal Filtre Malzemeleri
    { 
        id: 'aktif_karbon', 
        name: 'Aktif Karbon', 
        category: 'Kimyasal', 
        changeIntervalDays: 21, 
        consequence: 'Doygunluğa ulaştığında emdiği kimyasalları geri salabilir, su kalitesini bozar.' 
    },
    { 
        id: 'zeolit', 
        name: 'Zeolit', 
        category: 'Kimyasal', 
        changeIntervalDays: 60, 
        consequence: 'Amonyak tutma kapasitesini kaybeder, biyolojik döngüye yük biner.' 
    },
    { 
        id: 'fosfat_tutucu', 
        name: 'Fosfat Tutucu Reçine', 
        category: 'Kimyasal', 
        changeIntervalDays: 45, 
        consequence: 'Fosfat seviyeleri yükselir, bu da yosun patlamalarına neden olabilir.' 
    },
    { 
        id: 'silikat_tutucu', 
        name: 'Silikat Tutucu Malzeme', 
        category: 'Kimyasal', 
        changeIntervalDays: 60, 
        consequence: 'Silikat seviyeleri artar, özellikle diatom (kahverengi yosun) sorunlarına yol açar.' 
    },
    { 
        id: 'purigen', 
        name: 'Purigen', 
        category: 'Kimyasal', 
        changeIntervalDays: 90, 
        consequence: 'Organik atıkları emme kapasitesi düşer, nitrat seviyeleri artabilir. (Rejenere edilebilir)' 
    },
    { 
        id: 'torf', 
        name: 'Torf (Peat Moss)', 
        category: 'Kimyasal', 
        changeIntervalDays: 30, 
        consequence: 'pH düşürme ve suyu yumuşatma etkisini kaybeder.' 
    },
    { 
        id: 'iyon_degistirici_recine', 
        name: 'İyon Değiştirici Reçine', 
        category: 'Kimyasal', 
        changeIntervalDays: 90, 
        consequence: 'Su yumuşatma ve saflaştırma özelliğini kaybeder.' 
    },

    // Ekstra Destekleyici Malzemeler
    { 
        id: 'mineral_taslar', 
        name: 'Mineral Taşlar', 
        category: 'Ekstra', 
        changeIntervalDays: 180, 
        consequence: 'Suya eser element salınımı azalır.' 
    },
];