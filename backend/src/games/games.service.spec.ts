import { NumbersService } from './numbers.service';
import { CardsService } from './cards.service';
import { WordsService } from './words.service';

describe('Games Services', () => {
  describe('NumbersService', () => {
    let service: NumbersService;

    beforeEach(() => {
      service = new NumbersService();
    });

    it('should generate exact count of digits with correct chunking', () => {
      const res = service.generate(30, 2);
      expect(res.discipline).toBe('numbers');
      expect(res.sequence.length).toBe(30);
      expect(res.loci.length).toBe(15);
      expect(res.loci[0].length).toBe(2);
    });

    it('should handle 3-digit chunking', () => {
      const res = service.generate(21, 3);
      expect(res.loci.length).toBe(7);
      expect(res.loci[0].length).toBe(3);
    });
  });

  describe('CardsService', () => {
    let service: CardsService;

    beforeEach(() => {
      service = new CardsService();
    });

    it('should generate a full 52-card deck without duplicate cards', () => {
      const res = service.generate(52, 1);
      expect(res.discipline).toBe('cards');
      expect(res.cards.length).toBe(52);
      expect(res.loci.length).toBe(52);

      const uniqueKeys = new Set(res.cards.map((c) => c.key));
      expect(uniqueKeys.size).toBe(52);
    });

    it('should chunk 2 cards per locus', () => {
      const res = service.generate(26, 2);
      expect(res.loci.length).toBe(13);
      expect(res.loci[0].length).toBe(2);
    });
  });

  describe('WordsService', () => {
    let service: WordsService;

    beforeEach(() => {
      service = new WordsService();
    });

    it('should generate randomized list of words', () => {
      const res = service.generate(15);
      expect(res.discipline).toBe('words');
      expect(res.words.length).toBe(15);
      const unique = new Set(res.words);
      expect(unique.size).toBe(15);
    });
  });
});
