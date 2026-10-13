import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../core/store/game.store';
import { ApiService } from '../../core/services/api.service';
import { CardsConfigComponent } from './components/cards-config/cards-config.component';
import { CardsMemorizeComponent } from './components/cards-memorize/cards-memorize.component';
import { CardsRecallComponent } from './components/cards-recall/cards-recall.component';
import { EvaluationDiffComponent } from '../../shared/components/evaluation-diff/evaluation-diff.component';
import { CardsConfig, CardItem, EvaluationResult } from '../../core/models/game.models';

@Component({
  selector: 'app-speed-cards',
  standalone: true,
  imports: [
    CommonModule,
    CardsConfigComponent,
    CardsMemorizeComponent,
    CardsRecallComponent,
    EvaluationDiffComponent,
  ],
  template: `
    <div class="discipline-page">
      @switch (store.phase()) {
        @case ('CONFIG') {
          <app-cards-config (start)="onStartMemorize($event)"></app-cards-config>
        }
        @case ('MEMORIZE') {
          <app-cards-memorize></app-cards-memorize>
        }
        @case ('RECALL') {
          <app-cards-recall (submitRecall)="onSubmitRecall($event)"></app-cards-recall>
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
      padding: 40px 24px;
      min-height: calc(100vh - 80px);
    }
  `],
})
export class SpeedCardsComponent implements OnInit, OnDestroy {
  readonly store = inject(GameStore);
  private readonly api = inject(ApiService);

  private lastConfig: CardsConfig = {
    deckSize: 52,
    chunkSize: 1,
    autoPacerMs: 0,
    enablePaoHints: true,
  };

  ngOnInit() {
    this.store.setDiscipline('cards');
  }

  ngOnDestroy() {
    // Stop the timer and auto-pacer when leaving mid-session
    this.store.resetToConfig();
  }

  onStartMemorize(config: CardsConfig) {
    this.lastConfig = config;
    this.api
      .post<any>('games/cards/generate', {
        deckSize: config.deckSize,
        chunkSize: config.chunkSize,
      })
      .subscribe({
        next: (generated) => {
          this.store.startMemorization(generated, config);
        },
        error: (err) => {
          console.error('Failed to generate cards from backend', err);
          alert('Could not generate a new drill. Please make sure the backend is running.');
        },
      });
  }

  onSubmitRecall(recallCards: CardItem[]) {
    const payload = {
      discipline: 'cards',
      config: this.lastConfig,
      targetSequence: this.store.targetSequence(),
      recallSequence: recallCards,
      durationMs: this.store.timerMs(),
    };

    this.api.post<EvaluationResult>('sessions/evaluate', payload).subscribe({
      next: (res) => {
        this.store.finishEvaluation(res);
      },
      error: (err) => {
        console.error('Failed to evaluate cards from backend', err);
        alert('Could not evaluate this session. Please make sure the backend is running and try again.');
      },
    });
  }

  onRetry() {
    this.onStartMemorize(this.lastConfig);
  }
}
