import { Injectable, BadRequestException } from '@nestjs/common';
import { MEMORY_WORDS_DICTIONARY } from './words-dictionary.data';

export interface GeneratedWordsResponse {
  discipline: 'words';
  words: string[];
  totalWords: number;
}

@Injectable()
export class WordsService {
  generate(count = 20): GeneratedWordsResponse {
    if (!Number.isInteger(count) || count < 5 || count > 100) {
      throw new BadRequestException('Word count must be between 5 and 100');
    }

    const pool = [...MEMORY_WORDS_DICTIONARY];
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
