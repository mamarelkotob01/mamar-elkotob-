export interface Book {
  id: string;
  titleAr: string;
  titleEn: string;
  authorId: string;
  authorNameAr: string;
  authorNameEn: string;
  coverUrl: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  genre: string;
  genreAr: string;
  worldId?: string;
  tags: string[];
  format: 'digital' | 'physical' | 'both';
  language: 'ar' | 'en' | 'both';
  pages: number;
  publishedDate: string;
  isFeatured: boolean;
  isNew: boolean;
  readingOrderInWorld?: number;
}

export const books: Book[] = [
  {
    id: 'b001',
    titleAr: 'ظلال الأبدية',
    titleEn: 'Shadows of Eternity',
    authorId: 'a001',
    authorNameAr: 'أحمد الرشيد',
    authorNameEn: 'Ahmad Al-Rashid',
    coverUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'في عالم تتشابك فيه الظلال مع الضوء، يجد البطل نفسه في مواجهة مصيره الغامض. رحلة ملحمية عبر الزمن والمكان، حيث كل خطوة تكشف سراً جديداً من أسرار الكون.',
    descriptionEn: 'In a world where shadows intertwine with light, the hero faces his mysterious destiny. An epic journey through time and space, where every step reveals a new secret of the universe.',
    price: 49,
    originalPrice: 69,
    rating: 4.8,
    reviewCount: 1243,
    genre: 'Fantasy',
    genreAr: 'الخيال',
    worldId: 'w001',
    tags: ['ملحمة', 'خيال', 'مغامرة'],
    format: 'both',
    language: 'ar',
    pages: 480,
    publishedDate: '2024-01-15',
    isFeatured: true,
    isNew: false,
    readingOrderInWorld: 1,
  },
  {
    id: 'b002',
    titleAr: 'وارث النجوم',
    titleEn: 'The Star Heir',
    authorId: 'a001',
    authorNameAr: 'أحمد الرشيد',
    authorNameEn: 'Ahmad Al-Rashid',
    coverUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'الجزء الثاني من سلسلة ظلال الأبدية. عندما يكتشف البطل أصله النجمي، يجد نفسه في صراع كوني بين قوى لا يستطيع السيطرة عليها.',
    descriptionEn: 'The second installment in the Shadows of Eternity series. When the hero discovers his stellar origins, he finds himself in a cosmic conflict between forces beyond his control.',
    price: 49,
    rating: 4.9,
    reviewCount: 987,
    genre: 'Fantasy',
    genreAr: 'الخيال',
    worldId: 'w001',
    tags: ['ملحمة', 'خيال', 'كوني'],
    format: 'both',
    language: 'ar',
    pages: 520,
    publishedDate: '2024-06-01',
    isFeatured: true,
    isNew: true,
    readingOrderInWorld: 2,
  },
  {
    id: 'b003',
    titleAr: 'مدينة الأحلام المحطمة',
    titleEn: 'City of Shattered Dreams',
    authorId: 'a002',
    authorNameAr: 'سارة النعيمي',
    authorNameEn: 'Sara Al-Nuaimi',
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'في مدينة مستقبلية تحكمها الخوارزميات، تتحدى فتاة شابة النظام الذي سرق منها حلمها. رواية بوليسية خيالية مشحونة بالإثارة.',
    descriptionEn: 'In a future city governed by algorithms, a young woman challenges the system that stole her dream. A thrilling cyberpunk mystery charged with suspense.',
    price: 39,
    rating: 4.6,
    reviewCount: 756,
    genre: 'Sci-Fi',
    genreAr: 'الخيال العلمي',
    worldId: 'w002',
    tags: ['خيال علمي', 'غموض', 'مستقبل'],
    format: 'digital',
    language: 'ar',
    pages: 380,
    publishedDate: '2024-03-20',
    isFeatured: false,
    isNew: false,
    readingOrderInWorld: 1,
  },
  {
    id: 'b004',
    titleAr: 'بروتوكول فينيكس',
    titleEn: 'Phoenix Protocol',
    authorId: 'a002',
    authorNameAr: 'سارة النعيمي',
    authorNameEn: 'Sara Al-Nuaimi',
    coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'عندما تُعاد بطلتنا إلى الحياة بعد موتها على يد النظام، تصبح أكثر خطورة وأشد تصميماً على الانتقام.',
    descriptionEn: 'When our heroine is brought back to life after being killed by the system, she becomes more dangerous and more determined to take revenge.',
    price: 39,
    rating: 4.7,
    reviewCount: 621,
    genre: 'Sci-Fi',
    genreAr: 'الخيال العلمي',
    worldId: 'w002',
    tags: ['خيال علمي', 'انتقام', 'مستقبل'],
    format: 'digital',
    language: 'ar',
    pages: 420,
    publishedDate: '2024-09-10',
    isFeatured: true,
    isNew: true,
    readingOrderInWorld: 2,
  },
  {
    id: 'b005',
    titleAr: 'قلب الصحراء',
    titleEn: 'Heart of the Desert',
    authorId: 'a003',
    authorNameAr: 'خالد المنصور',
    authorNameEn: 'Khaled Al-Mansour',
    coverUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'ملحمة تاريخية تأخذك إلى قلب الجزيرة العربية في القرن الثامن، حيث يتشابك الحب والحرب والشرف في قصة لا تُنسى.',
    descriptionEn: 'A historical epic taking you to the heart of the Arabian Peninsula in the 8th century, where love, war, and honor intertwine in an unforgettable story.',
    price: 45,
    rating: 4.9,
    reviewCount: 1876,
    genre: 'Historical',
    genreAr: 'التاريخي',
    worldId: 'w003',
    tags: ['تاريخي', 'ملحمة', 'عربي'],
    format: 'both',
    language: 'ar',
    pages: 620,
    publishedDate: '2023-11-05',
    isFeatured: true,
    isNew: false,
    readingOrderInWorld: 1,
  },
  {
    id: 'b006',
    titleAr: 'ليالي الأندلس',
    titleEn: 'Nights of Andalusia',
    authorId: 'a003',
    authorNameAr: 'خالد المنصور',
    authorNameEn: 'Khaled Al-Mansour',
    coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'في ليالي الأندلس المضيئة بأقمار الشعر والموسيقى، تتصادم ثلاثة مصائر في لحظة تحدد تاريخ حضارة كاملة.',
    descriptionEn: 'In the nights of Andalusia illuminated by moons of poetry and music, three destinies collide in a moment that determines the fate of an entire civilization.',
    price: 45,
    rating: 4.8,
    reviewCount: 1234,
    genre: 'Historical',
    genreAr: 'التاريخي',
    worldId: 'w003',
    tags: ['تاريخي', 'أندلس', 'شعر'],
    format: 'both',
    language: 'ar',
    pages: 580,
    publishedDate: '2024-04-20',
    isFeatured: false,
    isNew: false,
    readingOrderInWorld: 2,
  },
  {
    id: 'b007',
    titleAr: 'في الظلام أسكن',
    titleEn: 'I Dwell in Darkness',
    authorId: 'a004',
    authorNameAr: 'لين العمري',
    authorNameEn: 'Layla Al-Omari',
    coverUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'رواية رعب نفسية تحتل عقلك لأيام. عندما تبدأ لينا في سماع أصوات من الجدران، تبدأ رحلة في أعماق الخوف البشري.',
    descriptionEn: 'A psychological horror novel that occupies your mind for days. When Lina begins hearing voices from the walls, a journey into the depths of human fear begins.',
    price: 35,
    rating: 4.5,
    reviewCount: 543,
    genre: 'Horror',
    genreAr: 'الرعب',
    tags: ['رعب', 'نفسي', 'إثارة'],
    format: 'digital',
    language: 'ar',
    pages: 320,
    publishedDate: '2024-07-31',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 'b008',
    titleAr: 'رسائل من المجهول',
    titleEn: 'Letters from the Unknown',
    authorId: 'a005',
    authorNameAr: 'ريم الحربي',
    authorNameEn: 'Reem Al-Harbi',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'قصة حب استثنائية تمتد عبر الأزمنة والقارات. عندما تجد مريم رسائل قديمة في منزل موروث، تكتشف قصة حب لا يصدقها العقل.',
    descriptionEn: 'An extraordinary love story spanning time and continents. When Mariam finds old letters in an inherited house, she discovers an unbelievable love story.',
    price: 32,
    rating: 4.7,
    reviewCount: 892,
    genre: 'Romance',
    genreAr: 'الرومانسية',
    tags: ['رومانسي', 'تاريخي', 'لغز'],
    format: 'both',
    language: 'ar',
    pages: 360,
    publishedDate: '2024-02-14',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 'b009',
    titleAr: 'أصوات الكون',
    titleEn: 'Voices of the Cosmos',
    authorId: 'a001',
    authorNameAr: 'أحمد الرشيد',
    authorNameEn: 'Ahmad Al-Rashid',
    coverUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'عندما يبدأ عالم الفلك بسماع أصوات من الفضاء، يدرك أن الكون ليس خالياً كما ظن. مغامرة علمية فلسفية تعيد تعريف موقعنا في الوجود.',
    descriptionEn: 'When an astronomer begins hearing voices from space, he realizes the universe is not as empty as he thought. A philosophical scientific adventure redefining our place in existence.',
    price: 42,
    rating: 4.6,
    reviewCount: 678,
    genre: 'Sci-Fi',
    genreAr: 'الخيال العلمي',
    tags: ['خيال علمي', 'فلسفة', 'كون'],
    format: 'digital',
    language: 'ar',
    pages: 440,
    publishedDate: '2024-08-15',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 'b010',
    titleAr: 'سر الجبل الأزرق',
    titleEn: 'Secret of the Blue Mountain',
    authorId: 'a006',
    authorNameAr: 'فهد البارودي',
    authorNameEn: 'Fahad Al-Baroudi',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'رواية مغامرات مثيرة للناشئة والكبار. مجموعة من الأصدقاء تكتشف سراً مدفوناً في قلب الجبل الأزرق الأسطوري.',
    descriptionEn: 'An exciting adventure novel for young and old alike. A group of friends discovers a secret buried in the heart of the legendary Blue Mountain.',
    price: 28,
    rating: 4.4,
    reviewCount: 445,
    genre: 'Adventure',
    genreAr: 'المغامرة',
    tags: ['مغامرة', 'اكتشاف', 'أسرار'],
    format: 'both',
    language: 'ar',
    pages: 280,
    publishedDate: '2024-05-10',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 'b011',
    titleAr: 'آخر الشهداء',
    titleEn: 'The Last Witnesses',
    authorId: 'a003',
    authorNameAr: 'خالد المنصور',
    authorNameEn: 'Khaled Al-Mansour',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'الجزء الثالث من سلسلة الملحمة العربية. المعركة الأخيرة تقترب، والشهود على أعظم حضارة عرفها التاريخ يتحضرون لكتابة نهاية ملحمية.',
    descriptionEn: 'The third part of the Arab Epic series. The final battle approaches, and witnesses to the greatest civilization in history prepare to write an epic ending.',
    price: 45,
    originalPrice: 55,
    rating: 4.9,
    reviewCount: 2341,
    genre: 'Historical',
    genreAr: 'التاريخي',
    worldId: 'w003',
    tags: ['تاريخي', 'ملحمة', 'حرب'],
    format: 'both',
    language: 'ar',
    pages: 700,
    publishedDate: '2024-10-01',
    isFeatured: true,
    isNew: true,
    readingOrderInWorld: 3,
  },
  {
    id: 'b012',
    titleAr: 'نسخة مكسورة',
    titleEn: 'A Broken Copy',
    authorId: 'a004',
    authorNameAr: 'لين العمري',
    authorNameEn: 'Layla Al-Omari',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80',
    descriptionAr: 'رواية معاصرة تجريبية تستكشف هشاشة الهوية في عصر الشبكات الاجتماعية. نص يكسر التوقعات ويعيد بناء القارئ.',
    descriptionEn: 'A contemporary experimental novel exploring the fragility of identity in the age of social networks. A text that breaks expectations and rebuilds the reader.',
    price: 35,
    rating: 4.3,
    reviewCount: 321,
    genre: 'Literary',
    genreAr: 'الأدبي',
    tags: ['أدبي', 'معاصر', 'تجريبي'],
    format: 'digital',
    language: 'ar',
    pages: 260,
    publishedDate: '2024-11-01',
    isFeatured: false,
    isNew: true,
  },
];

export function getBookById(id: string) {
  return books.find((b) => b.id === id);
}

export function getFeaturedBooks() {
  return books.filter((b) => b.isFeatured);
}

export function getNewBooks() {
  return books.filter((b) => b.isNew);
}

export function getBooksByWorld(worldId: string) {
  return books
    .filter((b) => b.worldId === worldId)
    .sort((a, b) => (a.readingOrderInWorld || 0) - (b.readingOrderInWorld || 0));
}

export function getBooksByAuthor(authorId: string) {
  return books.filter((b) => b.authorId === authorId);
}

export function getRecommendedBooks(bookId: string, limit = 4) {
  const book = getBookById(bookId);
  if (!book) return [];
  return books
    .filter((b) => b.id !== bookId && (b.genre === book.genre || b.authorId === book.authorId))
    .slice(0, limit);
}
