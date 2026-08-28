import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../core/store/game.store';
import { ApiService } from '../../core/services/api.service';
import { NumbersConfigComponent } from './components/numbers-config/numbers-config.component';
import { NumbersMemorizeComponent } from './components/numbers-memorize/numbers-memorize.component';
import { NumbersRecallComponent } from './components/numbers-recall/numbers-recall.component';
import { EvaluationDiffComponent } from '../../shared/components/evaluation-diff/evaluation-diff.component';
import { NumbersConfig, EvaluationResult } from '../../core/models/game.models';

@Component({
  selector: 'app-speed-numbers',
  standalone: true,
  imports: [
    CommonModule,
    NumbersConfigComponent,
    NumbersMemorizeComponent,
    NumbersRecallComponent,
    EvaluationDiffComponent,
  ],
  template: `
    <div class="discipline-page">
      @switch (store.phase()) {
        @case ('CONFIG') {
          <app-numbers-config (start)="onStartMemorize($event)"></app-numbers-config>
        }
        @case ('MEMORIZE') {
          <app-numbers-memorize></app-numbers-memorize>
        }
        @case ('RECALL') {
          <app-numbers-recall (submitRecall)="onSubmitRecall($event)"></app-numbers-recall>
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
export class SpeedNumbersComponent implements OnInit {
  readonly store = inject(GameStore);
  private readonly api = inject(ApiService);

  private lastConfig: NumbersConfig = {
    count: 20,
    chunkSize: 2,
    autoPacerMs: 0,
    enablePaoHints: true,
  };

  ngOnInit() {
    this.store.setDiscipline('numbers');
  }

  onStartMemorize(config: NumbersConfig) {
    this.lastConfig = config;
    this.api
      .post<any>('games/numbers/generate', {
        count: config.count,
        chunkSize: config.chunkSize,
      })
      .subscribe({
        next: (generated) => {
          this.store.startMemorization(generated, config);
        },
        error: (err) => {
          console.error('Failed to generate numbers from backend, using fallback', err);
          // Local fallback sequence
          let seq = '';
          for (let i = 0; i < config.count; i++) {
            seq += Math.floor(Math.random() * 10).toString();
          }
          const loci: string[] = [];
          for (let i = 0; i < seq.length; i += config.chunkSize) {
            loci.push(seq.slice(i, i + config.chunkSize));
          }
          this.store.startMemorization({ sequence: seq, loci }, config);
        },
      });
  }

  onSubmitRecall(recallString: string) {
    const payload = {
      discipline: 'numbers',
      config: this.lastConfig,
      targetSequence: this.store.targetSequence(),
      recallSequence: recallString,
      durationMs: this.store.timerMs(),
    };

    this.api.post<EvaluationResult>('sessions/evaluate', payload).subscribe({
      next: (res) => {
        this.store.finishEvaluation(res);
      },
      error: (err) => {
        console.error('Failed to evaluate numbers from backend', err);
      },
    });
  }

  onRetry() {
    this.onStartMemorize(this.lastConfig);
  }
}
