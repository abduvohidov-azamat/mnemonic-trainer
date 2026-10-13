import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { EvaluateSessionDto } from './dto/evaluate-session.dto';

export interface DiffItem {
  index: number;
  expected: any;
  actual: any;
  status: 'correct' | 'incorrect' | 'fuzzy' | 'missing';
  details?: string;
}

export interface EvaluationResult {
  discipline: string;
  accuracy: number;
  score: number;
  totalCorrect: number;
  totalItems: number;
  durationMs: number;
  speedDpm: number;
  diffBreakdown: DiffItem[];
  sessionId?: string;
  isPersonalBest?: boolean;
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  // Levenshtein distance helper for words fuzzy matching
  private levenshteinDistance(a: string, b: string): number {
    const s1 = a.toLowerCase().trim();
    const s2 = b.toLowerCase().trim();
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return dp[m][n];
  }

  evaluate(dto: EvaluateSessionDto): EvaluationResult {
    const { discipline, targetSequence, recallSequence, durationMs } = dto;
    const durationMinutes = Math.max(0.01, durationMs / 60000);

    let totalItems = 0;
    let totalCorrect = 0;
    const diffBreakdown: DiffItem[] = [];

    if (discipline === 'numbers') {
      const targetStr = typeof targetSequence === 'string' ? targetSequence : String(targetSequence);
      const recallStr = typeof recallSequence === 'string' ? recallSequence : String(recallSequence || '');
      totalItems = targetStr.length;

      for (let i = 0; i < totalItems; i++) {
        const expected = targetStr[i];
        const actual = /\d/.test(recallStr[i] || '') ? recallStr[i] : '';
        if (actual === expected) {
          totalCorrect++;
          diffBreakdown.push({ index: i, expected, actual, status: 'correct' });
        } else if (!actual) {
          diffBreakdown.push({ index: i, expected, actual: '—', status: 'missing' });
        } else {
          diffBreakdown.push({ index: i, expected, actual, status: 'incorrect' });
        }
      }
    } else if (discipline === 'cards') {
      const targetCards = Array.isArray(targetSequence) ? targetSequence : [];
      const recallCards = Array.isArray(recallSequence) ? recallSequence : [];
      totalItems = targetCards.length;

      for (let i = 0; i < totalItems; i++) {
        const target = targetCards[i];
        const recall = recallCards[i];
        const expectedKey = typeof target === 'string' ? target : target?.key;
        const actualKey = typeof recall === 'string' ? recall : recall?.key || '';

        if (expectedKey && actualKey && expectedKey === actualKey) {
          totalCorrect++;
          diffBreakdown.push({ index: i, expected: target, actual: recall, status: 'correct' });
        } else if (!actualKey) {
          diffBreakdown.push({ index: i, expected: target, actual: null, status: 'missing' });
        } else {
          diffBreakdown.push({ index: i, expected: target, actual: recall, status: 'incorrect' });
        }
      }
    } else if (discipline === 'words') {
      const targetWords = Array.isArray(targetSequence) ? targetSequence : [];
      const recallWords = Array.isArray(recallSequence) ? recallSequence : [];
      totalItems = targetWords.length;

      for (let i = 0; i < totalItems; i++) {
        const expected = String(targetWords[i] || '').trim();
        const actual = String(recallWords[i] || '').trim();

        if (!actual) {
          diffBreakdown.push({ index: i, expected, actual: '—', status: 'missing' });
          continue;
        }

        const dist = this.levenshteinDistance(expected, actual);
        if (dist === 0) {
          totalCorrect += 1;
          diffBreakdown.push({ index: i, expected, actual, status: 'correct', details: 'Exact Match' });
        } else if (dist <= 2 && expected.length > 4) {
          totalCorrect += 0.8;
          diffBreakdown.push({
            index: i,
            expected,
            actual,
            status: 'fuzzy',
            details: `Typo tolerance (${dist} char difference)`,
          });
        } else {
          diffBreakdown.push({ index: i, expected, actual, status: 'incorrect' });
        }
      }
    } else {
      throw new BadRequestException(`Unknown discipline: ${discipline}`);
    }

    const accuracy = totalItems > 0 ? Math.round((totalCorrect / totalItems) * 1000) / 10 : 0;
    const speedDpm = Math.round((totalCorrect / durationMinutes) * 10) / 10;
    const score = Math.round(totalCorrect * (accuracy / 100) * (60000 / Math.max(5000, durationMs)) * 100);

    return {
      discipline,
      accuracy,
      score,
      totalCorrect: Math.round(totalCorrect * 10) / 10,
      totalItems,
      durationMs,
      speedDpm,
      diffBreakdown,
    };
  }

  async saveSession(dto: EvaluateSessionDto, userId?: string): Promise<EvaluationResult> {
    const evaluated = this.evaluate(dto);
    const previousBest = userId
      ? await this.sessionRepository.maximum('score', { user: { id: userId }, discipline: dto.discipline })
      : null;

    const session = this.sessionRepository.create({
      user: userId ? ({ id: userId } as any) : null,
      discipline: dto.discipline,
      config: dto.config,
      targetSequence: dto.targetSequence,
      recallSequence: dto.recallSequence,
      accuracy: evaluated.accuracy,
      score: evaluated.score,
      totalCorrect: evaluated.totalCorrect,
      totalItems: evaluated.totalItems,
      durationMs: dto.durationMs,
      speedDpm: evaluated.speedDpm,
      diffBreakdown: evaluated.diffBreakdown,
    });

    const saved = await this.sessionRepository.save(session);
    return {
      ...evaluated,
      sessionId: saved.id,
      isPersonalBest: previousBest !== null && evaluated.score > previousBest,
    };
  }

  async getHistory(userId?: string, limit = 20): Promise<SessionEntity[]> {
    if (!userId) return [];
    return this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(userId?: string) {
    if (!userId) {
      return {
        totalSessions: 0,
        numbers: { sessions: 0, bestScore: 0, bestDpm: 0, avgAccuracy: 0 },
        cards: { sessions: 0, bestScore: 0, bestDpm: 0, avgAccuracy: 0 },
        words: { sessions: 0, bestScore: 0, bestDpm: 0, avgAccuracy: 0 },
      };
    }

    const allSessions = await this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    const stats = {
      totalSessions: allSessions.length,
      numbers: this.calculateDisciplineStats(allSessions.filter((s) => s.discipline === 'numbers')),
      cards: this.calculateDisciplineStats(allSessions.filter((s) => s.discipline === 'cards')),
      words: this.calculateDisciplineStats(allSessions.filter((s) => s.discipline === 'words')),
      recentHistory: allSessions.slice(-10).reverse(),
    };

    return stats;
  }

  private calculateDisciplineStats(sessions: SessionEntity[]) {
    if (sessions.length === 0) {
      return { sessions: 0, bestScore: 0, bestDpm: 0, avgAccuracy: 0, progress: [] };
    }

    let totalAcc = 0;
    let bestScore = 0;
    let bestDpm = 0;

    const progress = sessions.map((s) => {
      totalAcc += s.accuracy;
      if (s.score > bestScore) bestScore = s.score;
      if (s.speedDpm && s.speedDpm > bestDpm) bestDpm = s.speedDpm;
      return {
        date: s.createdAt,
        accuracy: s.accuracy,
        speedDpm: s.speedDpm,
        score: s.score,
      };
    });

    return {
      sessions: sessions.length,
      bestScore: Math.round(bestScore),
      bestDpm: Math.round(bestDpm * 10) / 10,
      avgAccuracy: Math.round((totalAcc / sessions.length) * 10) / 10,
      progress,
    };
  }
}
