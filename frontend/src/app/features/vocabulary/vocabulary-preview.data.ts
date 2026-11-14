// Sample cards for the vocabulary preview. These move to the backend once the format is settled.
// In `scene`, {…} marks the keyword and […] marks the translation, so the card can highlight both.

export type LearnerLang = 'uz' | 'ru';

export const LEARNER_LANGS: { code: LearnerLang; label: string }[] = [
  { code: 'uz', label: 'Oʻzbekcha' },
  { code: 'ru', label: 'Русский' },
];

export interface VocabHint {
  translation: string;
  keyword: string;
  scene: string;
  // Path under public/; each language has its own scene, so usually its own picture.
  image: string;
}

export interface VocabCard {
  word: string;
  // Kana spelling for Japanese words; also what the speech voice reads, since a lone kanji can be ambiguous.
  kana?: string;
  // IPA for English, romaji for Japanese.
  reading: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  example: string;
  exampleReading?: string;
  hints: Record<LearnerLang, VocabHint>;
}

export const ENGLISH_CARDS: VocabCard[] = [
  {
    word: 'clean',
    reading: '/kliːn/',
    partOfSpeech: 'verb',
    example: 'I clean my room every Saturday.',
    hints: {
      uz: {
        translation: 'tozalamoq',
        keyword: 'kelin',
        scene: '{Kelin} uyni [tozalamoqda].',
        image: 'vocab/uz-clean.svg',
      },
      ru: {
        translation: 'чистить',
        keyword: 'клинок',
        scene: 'Рыцарь до блеска [чистит] свой {клинок}.',
        image: 'vocab/ru-clean.svg',
      },
    },
  },
  {
    word: 'book',
    reading: '/bʊk/',
    partOfSpeech: 'noun',
    example: 'She is reading a book about space.',
    hints: {
      uz: {
        translation: 'kitob',
        keyword: 'buklamoq',
        scene: 'Ukam [kitobni] ikkiga {buklab} qoʻydi.',
        image: 'vocab/uz-book.svg',
      },
      ru: {
        translation: 'книга',
        keyword: 'бук',
        scene: 'Эта [книга] сделана из {бука}.',
        image: 'vocab/ru-book.svg',
      },
    },
  },
  {
    word: 'sun',
    reading: '/sʌn/',
    partOfSpeech: 'noun',
    example: 'The sun rises in the east.',
    hints: {
      uz: {
        translation: 'quyosh',
        keyword: '-san',
        scene: 'Sen mening [quyoshim]{san}!',
        image: 'vocab/uz-sun.svg',
      },
      ru: {
        translation: 'солнце',
        keyword: 'сын',
        scene: '{Сын} смотрит на [солнце].',
        image: 'vocab/ru-sun.svg',
      },
    },
  },
  {
    word: 'butterfly',
    reading: '/ˈbʌtəflaɪ/',
    partOfSpeech: 'noun',
    example: 'A butterfly landed on my hand.',
    hints: {
      uz: {
        translation: 'kapalak',
        keyword: 'boʻta',
        scene: '{Boʻta} [kapalakni] quvlab yuguryapti.',
        image: 'vocab/uz-butterfly.svg',
      },
      ru: {
        translation: 'бабочка',
        keyword: 'батя',
        scene: '{Батя} ловит сачком [бабочку].',
        image: 'vocab/ru-butterfly.svg',
      },
    },
  },
  {
    word: 'mountain',
    reading: '/ˈmaʊntən/',
    partOfSpeech: 'noun',
    example: 'We climbed the mountain last summer.',
    hints: {
      uz: {
        translation: 'togʻ',
        keyword: 'manti',
        scene: '[Togʻ] choʻqqisida katta {manti} bugʻlanyapti.',
        image: 'vocab/mountain.svg',
      },
      ru: {
        translation: 'гора',
        keyword: 'манты',
        scene: 'На вершине [горы] лежат горячие {манты}.',
        image: 'vocab/mountain.svg',
      },
    },
  },
  {
    word: 'tomorrow',
    reading: '/təˈmɒrəʊ/',
    partOfSpeech: 'adverb',
    example: 'I will call you tomorrow.',
    hints: {
      uz: {
        translation: 'ertaga',
        keyword: 'tomir',
        scene: '[Ertaga] shifokor {tomir}imni tekshiradi.',
        image: 'vocab/uz-tomorrow.svg',
      },
      ru: {
        translation: 'завтра',
        keyword: 'Тамара',
        scene: '{Тамара} приедет [завтра].',
        image: 'vocab/ru-tomorrow.svg',
      },
    },
  },
];
