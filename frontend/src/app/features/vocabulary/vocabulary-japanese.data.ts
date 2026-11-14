import type { VocabCard } from './vocabulary-preview.data';

// Temporary Japanese demo to show friends. To remove it, delete this file, its entry in
// COURSES (vocabulary.component.ts) and the public/vocab/ja/ folder.
export const JAPANESE_CARDS: VocabCard[] = [
  {
    word: 'きれい',
    reading: 'kirei',
    partOfSpeech: 'adjective',
    example: '部屋がきれいです。',
    exampleReading: 'Heya ga kirei desu.',
    hints: {
      uz: {
        translation: 'toza; chiroyli',
        keyword: 'kir',
        scene: '{Kir} koʻylakni yuvdim — endi [toza]!',
        image: 'vocab/ja/kirei.svg',
      },
      ru: {
        translation: 'чистый; красивый',
        keyword: 'Кира',
        scene: '{Кира} постирала рубашку — теперь она [чистая].',
        image: 'vocab/ja/kirei.svg',
      },
    },
  },
  {
    word: '本',
    kana: 'ほん',
    reading: 'hon',
    partOfSpeech: 'noun',
    example: '本を読みます。',
    exampleReading: 'Hon o yomimasu.',
    hints: {
      uz: {
        translation: 'kitob',
        keyword: 'xon',
        scene: '{Xon} taxtda [kitob] oʻqiyapti.',
        image: 'vocab/ja/uz-hon.svg',
      },
      ru: {
        translation: 'книга',
        keyword: 'Хонда',
        scene: '{Хонда} везёт целую гору [книг].',
        image: 'vocab/ja/ru-hon.svg',
      },
    },
  },
  {
    word: '太陽',
    kana: 'たいよう',
    reading: 'taiyō',
    partOfSpeech: 'noun',
    example: '太陽が出ました。',
    exampleReading: 'Taiyō ga demashita.',
    hints: {
      uz: {
        translation: 'quyosh',
        keyword: 'tayyor',
        scene: '[Quyosh] chiqdi — nonushta {tayyor}!',
        image: 'vocab/ja/uz-taiyo.svg',
      },
      ru: {
        translation: 'солнце',
        keyword: 'тает',
        scene: 'От [солнца] снеговик {тает}.',
        image: 'vocab/ja/ru-taiyo.svg',
      },
    },
  },
  {
    word: '蝶',
    kana: 'ちょう',
    reading: 'chō',
    partOfSpeech: 'noun',
    example: '蝶が飛んでいます。',
    exampleReading: 'Chō ga tonde imasu.',
    hints: {
      uz: {
        translation: 'kapalak',
        keyword: 'choʻl',
        scene: '{Choʻl}da boʻta [kapalakni] quvlayapti.',
        image: 'vocab/uz-butterfly.svg',
      },
      ru: {
        translation: 'бабочка',
        keyword: 'чокаться',
        scene: '[Бабочки] {чокаются} бокалами.',
        image: 'vocab/ja/ru-cho.svg',
      },
    },
  },
  {
    word: '山',
    kana: 'やま',
    reading: 'yama',
    partOfSpeech: 'noun',
    example: '山に登ります。',
    exampleReading: 'Yama ni noborimasu.',
    hints: {
      uz: {
        translation: 'togʻ',
        keyword: 'yamoq',
        scene: '[Togʻga] katta {yamoq} solingan.',
        image: 'vocab/ja/uz-yama.svg',
      },
      ru: {
        translation: 'гора',
        keyword: 'яма',
        scene: 'На вершине [горы] — огромная {яма}.',
        image: 'vocab/ja/ru-yama.svg',
      },
    },
  },
  {
    word: '明日',
    kana: 'あした',
    reading: 'ashita',
    partOfSpeech: 'adverb',
    example: '明日、電話します。',
    exampleReading: 'Ashita, denwa shimasu.',
    hints: {
      uz: {
        translation: 'ertaga',
        keyword: 'osh + it',
        scene: '{Osh}ni {it} yeb qoʻydi — yangisi [ertaga].',
        image: 'vocab/ja/uz-ashita.svg',
      },
      ru: {
        translation: 'завтра',
        keyword: 'а шито',
        scene: 'Портной: «{А шито} будет [завтра]».',
        image: 'vocab/ja/ru-ashita.svg',
      },
    },
  },
];
