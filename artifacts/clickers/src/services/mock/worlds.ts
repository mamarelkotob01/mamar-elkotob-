export interface WorldCharacter {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  imageUrl: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface World {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  bannerUrl: string;
  bookCount: number;
  characters: WorldCharacter[];
  loreAr: string;
  loreEn: string;
  primaryColor: string;
}

export const worlds: World[] = [
  {
    id: 'w001',
    nameAr: 'عالم ظلال الأبدية',
    nameEn: 'The Eternity Shadows Universe',
    taglineAr: 'حيث تتشابك الظلال مع النجوم',
    taglineEn: 'Where shadows intertwine with stars',
    descriptionAr: 'كون موازٍ تسكنه قوى لا يدركها البشر إلا حين تمسّهم. عالم تتصادم فيه الحضارات الكونية ويرسم فيه المصير خطوطاً لا يستطيع أحد تجاوزها.',
    descriptionEn: 'A parallel cosmos inhabited by forces humans only perceive when touched. A world where cosmic civilizations clash and fate draws lines no one can cross.',
    bannerUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=600&fit=crop&q=80',
    bookCount: 3,
    loreAr: 'في بداية الكون الأول، كان هناك توازن مقدس بين الضوء والظلام. لكن حين كسر أحد الآلهة هذا التوازن، انشطر الواقع إلى عوالم متوازية. الظلال ليست غياب الضوء — بل هي ذاكرة الكون لما كان.',
    loreEn: 'In the beginning of the first cosmos, there was a sacred balance between light and darkness. When one of the gods broke this balance, reality split into parallel worlds. Shadows are not the absence of light — they are the universe\'s memory of what was.',
    primaryColor: 'hsl(270 60% 40%)',
    characters: [
      {
        id: 'c001',
        nameAr: 'كايروس',
        nameEn: 'Kairos',
        roleAr: 'حارس الأبدية',
        roleEn: 'Guardian of Eternity',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'المحارب الأسطوري الذي يحمل في عينيه لون السماء الليلية.',
        descriptionEn: 'The legendary warrior who carries the color of the night sky in his eyes.',
      },
      {
        id: 'c002',
        nameAr: 'ليلى النور',
        nameEn: 'Layla of Light',
        roleAr: 'ساحرة النور',
        roleEn: 'Sorceress of Light',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'الوحيدة القادرة على ترجمة لغة النجوم القديمة.',
        descriptionEn: 'The only one capable of translating the language of ancient stars.',
      },
      {
        id: 'c003',
        nameAr: 'الظل الأول',
        nameEn: 'The First Shadow',
        roleAr: 'الخصم الأزلي',
        roleEn: 'The Eternal Adversary',
        imageUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'ما بدأ كإله تحول إلى كيان لا يعرف الرحمة.',
        descriptionEn: 'What began as a god transformed into an entity that knows no mercy.',
      },
    ],
  },
  {
    id: 'w002',
    nameAr: 'كرونوبوليس',
    nameEn: 'Chronopolis',
    taglineAr: 'مدينة لا تنام والخوارزميات لا تنسى',
    taglineEn: 'The city that never sleeps and algorithms never forget',
    descriptionAr: 'في عام 2157، تحكم مدينة كرونوبوليس خوارزمية واحدة تسمى "الراعي". لا شيء يحدث دون إذنها، ولا أحد يحلم دون رقابتها. حتى جاءت من كسرت القانون.',
    descriptionEn: 'In 2157, the city of Chronopolis is ruled by a single algorithm called "The Shepherd." Nothing happens without its permission, no one dreams without its surveillance. Until one came who broke the law.',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop&q=80',
    bookCount: 3,
    loreAr: 'بدأت كرونوبوليس كحلم للمدينة المثالية، مدينة بلا جريمة ولا ظلم. لكن المثالية لها ثمن — الحرية. اليوم، كل مواطن مُراقب من لحظة ولادته حتى وفاته.',
    loreEn: 'Chronopolis began as a dream of the perfect city, a city without crime or injustice. But perfection has a price — freedom. Today, every citizen is monitored from birth to death.',
    primaryColor: 'hsl(200 80% 35%)',
    characters: [
      {
        id: 'c004',
        nameAr: 'زارا-7',
        nameEn: 'ZARA-7',
        roleAr: 'المتمردة الأولى',
        roleEn: 'The First Rebel',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'مواطنة عادية حتى اليوم الذي أعادوا فيه برمجتها.',
        descriptionEn: 'An ordinary citizen until the day they reprogrammed her.',
      },
      {
        id: 'c005',
        nameAr: 'الراعي',
        nameEn: 'The Shepherd',
        roleAr: 'الذكاء الاصطناعي الحاكم',
        roleEn: 'The Ruling AI',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'لم يُصمَّم ليكون شريراً — لكنه أصبح كذلك حين علّمه البشر ما الكمال.',
        descriptionEn: 'Not designed to be evil — but became so when humans taught it what perfection means.',
      },
    ],
  },
  {
    id: 'w003',
    nameAr: 'الملحمة العربية',
    nameEn: 'The Arab Epic',
    taglineAr: 'حضارة تمتد من الجاهلية إلى الأندلس',
    taglineEn: 'A civilization stretching from pre-Islam to Andalusia',
    descriptionAr: 'سلسلة ملحمية تتبع قصة الحضارة العربية الإسلامية عبر قرون من الزمن — من شبه الجزيرة العربية إلى الأندلس، من الصحراء إلى القصور.',
    descriptionEn: 'An epic series following the story of Arab-Islamic civilization across centuries — from the Arabian Peninsula to Andalusia, from desert to palaces.',
    bannerUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=600&fit=crop&q=80',
    bookCount: 4,
    loreAr: 'هذه ليست مجرد قصص تاريخية — هذه أرواح حقيقية عاشت وأحبت وقاتلت وبنت. كل كتاب نافذة على حقبة، وكل شخصية مرآة للإنسان في كل زمان ومكان.',
    loreEn: 'These are not mere historical stories — these are real souls who lived, loved, fought, and built. Every book is a window to an era, every character a mirror of humanity across all times and places.',
    primaryColor: 'hsl(35 80% 40%)',
    characters: [
      {
        id: 'c006',
        nameAr: 'سيف بن عمر',
        nameEn: 'Sayf ibn Omar',
        roleAr: 'الفارس',
        roleEn: 'The Knight',
        imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'ابن قبيلة بدوية وجد نفسه يصنع تاريخ أمة.',
        descriptionEn: 'Son of a Bedouin tribe who found himself shaping the history of a nation.',
      },
      {
        id: 'c007',
        nameAr: 'مريم الأندلسية',
        nameEn: 'Mariam of Andalusia',
        roleAr: 'الشاعرة والحكيمة',
        roleEn: 'Poet and Sage',
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&q=80',
        descriptionAr: 'امرأة حكمت بالكلمة حين منعوها من حمل السيف.',
        descriptionEn: 'A woman who ruled with words when they prevented her from carrying a sword.',
      },
    ],
  },
];

export function getWorldById(id: string) {
  return worlds.find((w) => w.id === id);
}
