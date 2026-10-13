import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../core/store/game.store';
import { ApiService } from '../../core/services/api.service';
import { WordsConfigComponent } from './components/words-config/words-config.component';
import { WordsMemorizeComponent } from './components/words-memorize/words-memorize.component';
import { WordsRecallComponent } from './components/words-recall/words-recall.component';
import { EvaluationDiffComponent } from '../../shared/components/evaluation-diff/evaluation-diff.component';
import { WordsConfig, EvaluationResult } from '../../core/models/game.models';

@Component({
  selector: 'app-words-trainer',
  standalone: true,
  imports: [
    CommonModule,
    WordsConfigComponent,
    WordsMemorizeComponent,
    WordsRecallComponent,
    EvaluationDiffComponent,
  ],
  template: `
    <div class="discipline-page">
      @switch (store.phase()) {
        @case ('CONFIG') {
          <app-words-config (start)="onStartMemorize($event)"></app-words-config>
        }
        @case ('MEMORIZE') {
          <app-words-memorize></app-words-memorize>
        }
        @case ('RECALL') {
          <app-words-recall (submitRecall)="onSubmitRecall($event)"></app-words-recall>
        }
        @case ('RESULTS') {
          <app-evaluation-diff
            [result]="store.evaluatedResult()"
            (retry)="onRetry()"
            (toConfig)="store.resetToConfig()"
          ></app-evaluation-diff>
        }
      }
    </div>
  `,
  styles: [`
    .discipline-page {
      padding: 32px 24px 48px;

      @media (max-width: 600px) {
        padding: 20px 16px 40px;
      }
    }
  `],
})
export class WordsTrainerComponent implements OnInit, OnDestroy {
  readonly store = inject(GameStore);
  private readonly api = inject(ApiService);

  private lastConfig: WordsConfig = {
    count: 20,
    autoPacerMs: 0,
  };

  ngOnInit() {
    this.store.setDiscipline('words');
  }

  ngOnDestroy() {
    this.store.resetToConfig();
  }

  onStartMemorize(config: WordsConfig) {
    this.lastConfig = config;
    this.api
      .post<any>('games/words/generate', { count: config.count })
      .subscribe({
        next: (generated) => {
          this.store.startMemorization(generated, config);
        },
        error: (err) => {
          console.error('Failed to generate words from backend', err);
          alert('Could not generate a new drill. Please make sure the backend is running.');
        },
      });
  }

  onSubmitRecall(recalledWords: string[]) {
    const payload = {
      discipline: 'words',
      config: this.lastConfig,
      targetSequence: this.store.targetSequence(),
      recallSequence: recalledWords,
      durationMs: this.store.timerMs(),
    };

    this.api.post<EvaluationResult>('sessions/evaluate', payload).subscribe({
      next: (res) => {
        this.store.finishEvaluation(res);
      },
      error: (err) => {
        console.error('Failed to evaluate words from backend', err);
        alert('Could not evaluate this session. Please make sure the backend is running and try again.');
      },
    });
  }

  onRetry() {
    this.onStartMemorize(this.lastConfig);
  }
}
