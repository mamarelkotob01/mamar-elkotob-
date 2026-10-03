export interface MediaItem {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'trailer' | 'music' | 'video';
  thumbnailUrl: string;
  duration: string;
  bookId?: string;
  worldId?: string;
  descriptionAr: string;
  descriptionEn: string;
  publishedDate: string;
}

export const mediaItems: MediaItem[] = [
  {
    id: 'm001',
    titleAr: 'الإعلان الرسمي - ظلال الأبدية',
    titleEn: 'Official Trailer - Shadows of Eternity',
    type: 'trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600&h=340&fit=crop&q=80',
    duration: '2:34',
    bookId: 'b001',
    worldId: 'w001',
    descriptionAr: 'شاهد الإعلان الرسمي لرائعة أحمد الرشيد الملحمية',
    descriptionEn: 'Watch the official trailer for Ahmad Al-Rashid\'s epic masterpiece',
    publishedDate: '2024-01-10',
  },
  {
    id: 'm002',
    titleAr: 'إعلان كرونوبوليس',
    titleEn: 'Chronopolis Trailer',
    type: 'trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=340&fit=crop&q=80',
    duration: '3:12',
    worldId: 'w002',
    descriptionAr: 'ادخل عالم كرونوبوليس الديستوبي المثير',
    descriptionEn: 'Enter the thrilling dystopian world of Chronopolis',
    publishedDate: '2024-03-15',
  },
  {
    id: 'm003',
    titleAr: 'الموسيقى التجريبية - ظلال الأبدية',
    titleEn: 'Ambient Score - Shadows of Eternity',
    type: 'music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=340&fit=crop&q=80',
    duration: '45:22',
    bookId: 'b001',
    descriptionAr: 'الموسيقى التجريبية الكاملة لقراءة مغمورة',
    descriptionEn: 'Full ambient score for an immersive reading experience',
    publishedDate: '2024-01-15',
  },
  {
    id: 'm004',
    titleAr: 'لقاء مع أحمد الرشيد',
    titleEn: 'Interview with Ahmad Al-Rashid',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=340&fit=crop&q=80',
    duration: '28:45',
    descriptionAr: 'جلسة حصرية مع المؤلف يكشف فيها أسرار عالمه الملحمي',
    descriptionEn: 'Exclusive session with the author revealing secrets of his epic world',
    publishedDate: '2024-02-20',
  },
  {
    id: 'm005',
    titleAr: 'إعلان الملحمة العربية',
    titleEn: 'Arab Epic Trailer',
    type: 'trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=340&fit=crop&q=80',
    duration: '4:01',
    worldId: 'w003',
    descriptionAr: 'الإعلان الكامل للملحمة التاريخية التي أثارت الجميع',
    descriptionEn: 'Full trailer for the historical epic that moved everyone',
    publishedDate: '2023-11-01',
  },
  {
    id: 'm006',
    titleAr: 'موسيقى قلب الصحراء',
    titleEn: 'Heart of the Desert Score',
    type: 'music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=340&fit=crop&q=80',
    duration: '58:30',
    bookId: 'b005',
    descriptionAr: 'موسيقى عربية أصيلة تصحبك في رحلتك عبر الصحراء',
    descriptionEn: 'Authentic Arabic music accompanying you on your desert journey',
    publishedDate: '2023-11-05',
  },
  {
    id: 'm007',
    titleAr: 'إعلان وارث النجوم',
    titleEn: 'Star Heir Trailer',
    type: 'trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&h=340&fit=crop&q=80',
    duration: '2:58',
    bookId: 'b002',
    descriptionAr: 'الإعلان الرسمي للجزء الثاني من ظلال الأبدية',
    descriptionEn: 'Official trailer for the second installment of Shadows of Eternity',
    publishedDate: '2024-05-25',
  },
  {
    id: 'm008',
    titleAr: 'حوار مع سارة النعيمي',
    titleEn: 'Conversation with Sara Al-Nuaimi',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=340&fit=crop&q=80',
    duration: '35:20',
    descriptionAr: 'سارة تتحدث عن مستقبل الخيال العلمي العربي',
    descriptionEn: 'Sara talks about the future of Arabic sci-fi',
    publishedDate: '2024-04-10',
  },
];

export function getMediaByType(type: MediaItem['type']) {
  return mediaItems.filter((m) => m.type === type);
}
