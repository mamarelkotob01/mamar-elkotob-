export interface Offer {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  discountPercent: number;
  bannerUrl: string;
  endDate: string;
  bookIds?: string[];
  code?: string;
  type: 'bundle' | 'seasonal' | 'flash' | 'launch';
  primaryColor: string;
}

export const offers: Offer[] = [
  {
    id: 'o001',
    titleAr: 'حزمة ملحمة الظلال الكاملة',
    titleEn: 'Complete Eternity Shadows Bundle',
    descriptionAr: 'اقتنِ السلسلة الكاملة بخصم 35% واغمر نفسك في العالم الكامل',
    descriptionEn: 'Get the complete series with 35% off and immerse yourself in the full universe',
    discountPercent: 35,
    bannerUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop&q=80',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    bookIds: ['b001', 'b002'],
    code: 'ETERNITY35',
    type: 'bundle',
    primaryColor: 'hsl(270 60% 40%)',
  },
  {
    id: 'o002',
    titleAr: 'عرض الشتاء الكبير',
    titleEn: 'Grand Winter Sale',
    descriptionAr: 'خصم 25% على جميع الروايات التاريخية لفترة محدودة',
    descriptionEn: '25% off on all historical novels for a limited time',
    discountPercent: 25,
    bannerUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=400&fit=crop&q=80',
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    code: 'WINTER25',
    type: 'seasonal',
    primaryColor: 'hsl(35 80% 40%)',
  },
  {
    id: 'o003',
    titleAr: 'إطلاق آخر الشهداء',
    titleEn: 'Last Witnesses Launch Offer',
    descriptionAr: 'أول 500 نسخة بسعر إطلاق استثنائي',
    descriptionEn: 'First 500 copies at exceptional launch price',
    discountPercent: 20,
    bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop&q=80',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    bookIds: ['b011'],
    code: 'LAUNCH20',
    type: 'launch',
    primaryColor: 'hsl(45 85% 40%)',
  },
  {
    id: 'o004',
    titleAr: 'عرض البرق: يوم واحد فقط',
    titleEn: 'Flash Sale: One Day Only',
    descriptionAr: 'خصم 40% على المجموعة الكاملة لكليكرز لمدة 24 ساعة',
    descriptionEn: '40% off on all Clickers collection for 24 hours only',
    discountPercent: 40,
    bannerUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&q=80',
    endDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    code: 'FLASH40',
    type: 'flash',
    primaryColor: 'hsl(200 80% 35%)',
  },
];
