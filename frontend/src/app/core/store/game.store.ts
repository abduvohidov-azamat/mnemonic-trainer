import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { DisciplineType, GamePhase, EvaluationResult } from '../models/game.models';
import { PaoService } from '../services/pao.service';
import { PaoEntry } from '../models/pao.models';

@Injectable({
  providedIn: 'root',
})
export class GameStore {
  private readonly paoService = inject(PaoService);

  // Core State Signals
  readonly discipline = signal<DisciplineType>('numbers');
  readonly phase = signal<GamePhase>('CONFIG');
  readonly activeLocusIndex = signal<number>(0);
  readonly timerMs = signal<number>(0);
  readonly isTimerRunning = signal<boolean>(false);

  readonly targetSequence = signal<any>(null);
  readonly targetLoci = signal<any[]>([]);
  readonly recallAnswers = signal<any[]>([]);
  readonly evaluatedResult = signal<EvaluationResult | null>(null);

  readonly config = signal<Record<string, any>>({});
  readonly enablePaoHints = signal<boolean>(true);
  readonly autoPacerMs = signal<number>(0);

  private timerInterval: any = null;
  private autoPacerInterval: any = null;
  private startTime = 0;

  // Computed Values
  readonly totalLoci = computed(() => this.targetLoci().length);
  readonly isLastLocus = computed(() => this.activeLocusIndex() >= this.totalLoci() - 1);
  readonly activeLocusContent = computed(() => {
    const loci = this.targetLoci();
    const idx = this.activeLocusIndex();
    return loci[idx] !== undefined ? loci[idx] : null;
  });

  readonly currentPaoHint = computed<PaoEntry | null>(() => {
    if (!this.enablePaoHints()) return null;
    const content = this.activeLocusContent();
    if (!content) return null;

    if (this.discipline() === 'numbers') {
      const key = typeof content === 'string' ? content : String(content);
      return this.paoService.getHintForChunk(key);
    } else if (this.discipline() === 'cards') {
      const cardKey = Array.isArray(content) ? content[0]?.key : content?.key;
      return cardKey ? this.paoService.getHintForChunk(cardKey) : null;
    }
    return null;
  });

  readonly formattedTimer = computed(() => {
    const ms = this.timerMs();
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  });

  // State Mutators
  setDiscipline(disc: DisciplineType) {
    this.discipline.set(disc);
    this.resetToConfig();
  }

  startMemorization(generated: { sequence?: any; cards?: any; words?: any; loci?: any[] }, config: any) {
    this.stopTimer();
    this.clearAutoPacer();

    this.config.set(config);
    this.enablePaoHints.set(config.enablePaoHints ?? true);
    this.autoPacerMs.set(config.autoPacerMs ?? 0);

    this.targetSequence.set(generated.sequence || generated.cards || generated.words);
    this.targetLoci.set(generated.loci || (generated.words ? generated.words.map((w: string) => [w]) : []));
    this.activeLocusIndex.set(0);
    this.evaluatedResult.set(null);
    this.phase.set('MEMORIZE');

    this.startTimer();

    if (this.autoPacerMs() > 0) {
      this.startAutoPacer(this.autoPacerMs());
    }
  }

  startRecall() {
    this.stopTimer();
    this.clearAutoPacer();
    this.phase.set('RECALL');
    this.activeLocusIndex.set(0);

    // Initialize blank recall answers corresponding to target loci/items
    if (this.discipline() === 'numbers') {
      this.recallAnswers.set([]);
    } else if (this.discipline() === 'cards') {
      this.recallAnswers.set([]);
    } else if (this.discipline() === 'words') {
      const count = this.targetLoci().length;
      this.recallAnswers.set(Array(count).fill(''));
    }
  }

  setRecallAnswers(answers: any[]) {
    this.recallAnswers.set(answers);
  }

  finishEvaluation(result: EvaluationResult) {
    this.evaluatedResult.set(result);
    this.phase.set('RESULTS');
  }

  resetToConfig() {
    this.stopTimer();
    this.clearAutoPacer();
    this.timerMs.set(0);
    this.phase.set('CONFIG');
    this.activeLocusIndex.set(0);
    this.targetSequence.set(null);
    this.targetLoci.set([]);
    this.recallAnswers.set([]);
    this.evaluatedResult.set(null);
  }

  nextLocus() {
    const next = this.activeLocusIndex() + 1;
    if (next < this.totalLoci()) {
      this.activeLocusIndex.set(next);
    } else {
      // Completed last locus during memorization
      if (this.phase() === 'MEMORIZE') {
        this.startRecall();
      }
    }
  }

  prevLocus() {
    const prev = this.activeLocusIndex() - 1;
    if (prev >= 0) {
      this.activeLocusIndex.set(prev);
    }
  }

  setLocus(index: number) {
    if (index >= 0 && index < this.totalLoci()) {
      this.activeLocusIndex.set(index);
    }
  }

  togglePaoHints() {
    this.enablePaoHints.update((v) => !v);
  }

  // Timer logic
  private startTimer() {
    this.timerMs.set(0);
    this.isTimerRunning.set(true);
    this.startTime = performance.now();

    this.timerInterval = setInterval(() => {
      const now = performance.now();
      this.timerMs.set(Math.floor(now - this.startTime));
    }, 16); // ~60fps millisecond update
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning.set(false);
  }

  private startAutoPacer(ms: number) {
    this.autoPacerInterval = setInterval(() => {
      this.nextLocus();
    }, ms);
  }

  private clearAutoPacer() {
    if (this.autoPacerInterval) {
      clearInterval(this.autoPacerInterval);
      this.autoPacerInterval = null;
    }
  }
}
