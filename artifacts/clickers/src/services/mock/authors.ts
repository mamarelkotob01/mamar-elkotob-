export interface Author {
  id: string;
  nameAr: string;
  nameEn: string;
  bioAr: string;
  bioEn: string;
  imageUrl: string;
  bookCount: number;
  readerCount: number;
  rating: number;
  nationality: string;
  genres: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export const authors: Author[] = [
  {
    id: 'a001',
    nameAr: 'أحمد الرشيد',
    nameEn: 'Ahmad Al-Rashid',
    bioAr: 'روائي سعودي ولد في الرياض عام 1982. درس الأدب الإنجليزي في جامعة الملك عبدالعزيز قبل أن يتحول كلياً للكتابة. يُعرف بأسلوبه الملحمي الذي يمزج بين الخيال العلمي والميثولوجيا. حصل على جائزة البوكر العربية عام 2022.',
    bioEn: 'A Saudi novelist born in Riyadh in 1982. He studied English Literature at King Abdulaziz University before turning fully to writing. Known for his epic style that blends sci-fi and mythology. Won the Arabic Booker Prize in 2022.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
    bookCount: 8,
    readerCount: 245000,
    rating: 4.8,
    nationality: 'Saudi Arabia',
    genres: ['Fantasy', 'Sci-Fi'],
    socialLinks: {
      twitter: '@ahmad_alrashid',
      instagram: '@ahmadalrashid_writes',
    },
  },
  {
    id: 'a002',
    nameAr: 'سارة النعيمي',
    nameEn: 'Sara Al-Nuaimi',
    bioAr: 'كاتبة إماراتية من أبوظبي. تخصصت في الديستوبيا والخيال العلمي النسوي. روايتها الأولى "مدينة الأحلام المحطمة" أصبحت ظاهرة أدبية في منطقة الخليج. حاصلة على درجة الدكتوراه في الأدب المقارن.',
    bioEn: 'An Emirati writer from Abu Dhabi. She specializes in dystopia and feminist sci-fi. Her first novel "City of Shattered Dreams" became a literary phenomenon in the Gulf region. Holds a PhD in Comparative Literature.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
    bookCount: 5,
    readerCount: 178000,
    rating: 4.7,
    nationality: 'UAE',
    genres: ['Sci-Fi', 'Mystery'],
    socialLinks: {
      twitter: '@sara_nuaimi',
      website: 'www.saranuaimi.ae',
    },
  },
  {
    id: 'a003',
    nameAr: 'خالد المنصور',
    nameEn: 'Khaled Al-Mansour',
    bioAr: 'مؤرخ وروائي كويتي. أمضى عشرين عاماً في دراسة التاريخ العربي الإسلامي قبل أن يصبح الكاتب الأكثر مبيعاً في الرواية التاريخية. تُدرَّس أعماله في الجامعات العربية. يُلقب بـ"رهوان التاريخ".',
    bioEn: 'A Kuwaiti historian and novelist. He spent twenty years studying Arab-Islamic history before becoming the best-selling author in historical fiction. His works are taught in Arab universities. Known as "The Rider of History".',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    bookCount: 12,
    readerCount: 520000,
    rating: 4.9,
    nationality: 'Kuwait',
    genres: ['Historical', 'Literary'],
    socialLinks: {
      twitter: '@khaled_mansour_kw',
      instagram: '@khaledmansourbooks',
    },
  },
  {
    id: 'a004',
    nameAr: 'لين العمري',
    nameEn: 'Layla Al-Omari',
    bioAr: 'روائية أردنية تخصصت في الأدب التجريبي والرعب النفسي. أعمالها تستكشف الهشاشة الإنسانية بأسلوب يتحدى بنية الرواية التقليدية. حاصلة على جوائز أدبية من ثلاث قارات.',
    bioEn: 'A Jordanian novelist specializing in experimental literature and psychological horror. Her works explore human fragility with a style that challenges traditional novel structure. Has won literary prizes from three continents.',
    imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&q=80',
    bookCount: 6,
    readerCount: 134000,
    rating: 4.5,
    nationality: 'Jordan',
    genres: ['Horror', 'Literary'],
    socialLinks: {
      instagram: '@layla.alomari',
      website: 'www.laylaomari.com',
    },
  },
  {
    id: 'a005',
    nameAr: 'ريم الحربي',
    nameEn: 'Reem Al-Harbi',
    bioAr: 'شاعرة وروائية سعودية من جدة. كتابتها تمزج بين الشعر والسرد بأسلوب لغوي بديع. فازت بجائزة كتارا للرواية العربية. رواياتها تُتصدر قوائم المبيعات في كل إصدار.',
    bioEn: 'A Saudi poet and novelist from Jeddah. Her writing blends poetry and narrative with exquisite linguistic style. She won the Katara Prize for the Arabic Novel. Her novels top sales charts with each release.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
    bookCount: 4,
    readerCount: 203000,
    rating: 4.7,
    nationality: 'Saudi Arabia',
    genres: ['Romance', 'Literary'],
    socialLinks: {
      twitter: '@reem_alharbi',
      instagram: '@reemharbiwriter',
    },
  },
  {
    id: 'a006',
    nameAr: 'فهد البارودي',
    nameEn: 'Fahad Al-Baroudi',
    bioAr: 'كاتب مصري متخصص في أدب المغامرات. أعماله مناسبة لجميع الأعمار وتُرجمت إلى سبع لغات. يُعرف بقدرته على نسج عوالم خيالية ذات عمق فلسفي خلف مغامراتها المثيرة.',
    bioEn: 'An Egyptian writer specializing in adventure literature. His works are suitable for all ages and have been translated into seven languages. Known for his ability to weave fantastical worlds with philosophical depth behind their thrilling adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80',
    bookCount: 9,
    readerCount: 312000,
    rating: 4.4,
    nationality: 'Egypt',
    genres: ['Adventure', 'Literary'],
    socialLinks: {
      twitter: '@fahad_baroudi',
    },
  },
];

export function getAuthorById(id: string) {
  return authors.find((a) => a.id === id);
}
