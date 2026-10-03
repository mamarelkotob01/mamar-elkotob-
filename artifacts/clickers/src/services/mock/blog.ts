export interface BlogPost {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  authorId: string;
  authorNameAr: string;
  authorNameEn: string;
  imageUrl: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    titleAr: 'فن السرد في الأدب العربي المعاصر',
    titleEn: 'The Art of Narrative in Contemporary Arabic Literature',
    excerptAr: 'رحلة في أعماق التقنيات السردية التي يستخدمها الروائيون العرب اليوم لتشكيل هويتهم الأدبية.',
    excerptEn: 'A journey into the narrative techniques used by Arab novelists today to shape their literary identity.',
    contentAr: '...',
    contentEn: '...',
    authorId: '1',
    authorNameAr: 'أحمد مراد',
    authorNameEn: 'Ahmed Mourad',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    date: '2024-03-15',
    category: 'Literature',
    readTime: '5 min'
  },
  {
    id: '2',
    titleAr: 'كيف تختار كتابك القادم؟',
    titleEn: 'How to Choose Your Next Book?',
    excerptAr: 'نصائح عملية للقراء لتجاوز حيرة الاختيار أمام رفوف المكتبات المزدحمة.',
    excerptEn: 'Practical tips for readers to overcome the dilemma of choosing in front of crowded library shelves.',
    contentAr: '...',
    contentEn: '...',
    authorId: '2',
    authorNameAr: 'خولة حمدي',
    authorNameEn: 'Khawla Hamdi',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    date: '2024-03-10',
    category: 'Guides',
    readTime: '3 min'
  },
  {
    id: '3',
    titleAr: 'مستقبل النشر الرقمي في العالم العربي',
    titleEn: 'The Future of Digital Publishing in the Arab World',
    excerptAr: 'تحليل للتحولات التي تشهدها صناعة النشر مع صعود الكتب الإلكترونية والصوتية.',
    excerptEn: 'An analysis of the shifts in the publishing industry with the rise of e-books and audiobooks.',
    contentAr: '...',
    contentEn: '...',
    authorId: '1',
    authorNameAr: 'أحمد مراد',
    authorNameEn: 'Ahmed Mourad',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    date: '2024-03-05',
    category: 'Industry',
    readTime: '8 min'
  }
];
