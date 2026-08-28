export type DisciplineType = 'numbers' | 'cards' | 'words';
export type GamePhase = 'CONFIG' | 'MEMORIZE' | 'RECALL' | 'RESULTS';

export interface CardItem {
  key: string;
  suit: 'S' | 'H' | 'D' | 'C';
  suitName: string;
  suitSymbol: string;
  suitColor: 'black' | 'red';
  rank: string;
  name: string;
}

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
}

export interface NumbersConfig {
  count: number;
  chunkSize: number;
  autoPacerMs: number; // 0 = manual
  enablePaoHints: boolean;
}

export interface CardsConfig {
  deckSize: number;
  chunkSize: number;
  autoPacerMs: number;
  enablePaoHints: boolean;
}

export interface WordsConfig {
  count: number;
  autoPacerMs: number;
}
