import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(() => {
    // Mock repository
    const mockRepo = {} as any;
    service = new SessionsService(mockRepo);
  });

  describe('evaluate numbers', () => {
    it('should calculate 100% accuracy for exact match', () => {
      const res = service.evaluate({
        discipline: 'numbers',
        config: { chunkSize: 2 },
        targetSequence: '123456',
        recallSequence: '123456',
        durationMs: 10000,
      });

      expect(res.accuracy).toBe(100);
      expect(res.totalCorrect).toBe(6);
      expect(res.totalItems).toBe(6);
      expect(res.diffBreakdown.every((d) => d.status === 'correct')).toBe(true);
    });

    it('should detect mismatching and missing digits', () => {
      const res = service.evaluate({
        discipline: 'numbers',
        config: { chunkSize: 2 },
        targetSequence: '123456',
        recallSequence: '1294',
        durationMs: 10000,
      });

      expect(res.totalCorrect).toBe(3); // '1', '2', '4'
      expect(res.diffBreakdown[2].status).toBe('incorrect');
      expect(res.diffBreakdown[4].status).toBe('missing');
    });
  });

  describe('evaluate cards', () => {
    it('should evaluate matching and missing card deck', () => {
      const target = [{ key: 'AS' }, { key: 'KH' }, { key: '2D' }];
      const recall = [{ key: 'AS' }, { key: 'QS' }, { key: '' }];

      const res = service.evaluate({
        discipline: 'cards',
        config: { chunkSize: 1 },
        targetSequence: target,
        recallSequence: recall,
        durationMs: 15000,
      });

      expect(res.totalCorrect).toBe(1);
      expect(res.diffBreakdown[0].status).toBe('correct');
      expect(res.diffBreakdown[1].status).toBe('incorrect');
      expect(res.diffBreakdown[2].status).toBe('missing');
    });
  });

  describe('evaluate words with fuzzy Levenshtein distance', () => {
    it('should recognize exact matches and minor typos', () => {
      const target = ['Airplane', 'Elephant', 'Binoculars'];
      const recall = ['Airplane', 'Elefant', 'Guitar']; // 'Elefant' is typo of Elephant

      const res = service.evaluate({
        discipline: 'words',
        config: {},
        targetSequence: target,
        recallSequence: recall,
        durationMs: 20000,
      });

      expect(res.diffBreakdown[0].status).toBe('correct');
      expect(res.diffBreakdown[1].status).toBe('fuzzy');
      expect(res.diffBreakdown[2].status).toBe('incorrect');
    });
  });
});
