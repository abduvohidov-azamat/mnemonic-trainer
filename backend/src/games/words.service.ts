import { Injectable, BadRequestException } from '@nestjs/common';
import { MEMORY_WORDS_DICTIONARY } from './words-dictionary.data';
import { MEMORY_WORDS_DICTIONARY_UZ } from './words-dictionary-uz.data';
import { MEMORY_WORDS_DICTIONARY_RU } from './words-dictionary-ru.data';

export const WORD_LANGUAGES = ['en', 'uz', 'ru'] as const;
export type WordLanguage = (typeof WORD_LANGUAGES)[number];

const DICTIONARIES: Record<WordLanguage, string[]> = {
  en: MEMORY_WORDS_DICTIONARY,
  uz: MEMORY_WORDS_DICTIONARY_UZ,
  ru: MEMORY_WORDS_DICTIONARY_RU,
};

export interface GeneratedWordsResponse {
  discipline: 'words';
  words: string[];
  totalWords: number;
}

@Injectable()
export class WordsService {
  generate(count = 20, lang: WordLanguage = 'en'): GeneratedWordsResponse {
    if (!Number.isInteger(count) || count < 5 || count > 100) {
      throw new BadRequestException('Word count must be between 5 and 100');
    }

    const pool = [...(DICTIONARIES[lang] ?? DICTIONARIES.en)];
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const words = pool.slice(0, count);

    return {
      discipline: 'words',
      words,
      totalWords: words.length,
    };
  }
}
