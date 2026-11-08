import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../core/store/game.store';
import { ApiService } from '../../core/services/api.service';
import { CardsConfigComponent } from './components/cards-config/cards-config.component';
import { CardsMemorizeComponent } from './components/cards-memorize/cards-memorize.component';
import { CardsRecallComponent } from './components/cards-recall/cards-recall.component';
import { EvaluationDiffComponent } from '../../shared/components/evaluation-diff/evaluation-diff.component';
import { CardsConfig, CardItem, EvaluationResult } from '../../core/models/game.models';
import { I18nService } from '../../core/i18n/i18n.service';

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
      padding: 32px 24px 48px;

      @media (max-width: 600px) {
        padding: 20px 16px 40px;
      }
    }
  `],
})
export class SpeedCardsComponent implements OnInit, OnDestroy {
  readonly store = inject(GameStore);
  private readonly api = inject(ApiService);
  private readonly i18n = inject(I18nService);

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
          alert(this.i18n.t('errors.generate'));
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
        alert(this.i18n.t('errors.evaluate'));
      },
    });
  }

  onRetry() {
    this.onStartMemorize(this.lastConfig);
  }
}
