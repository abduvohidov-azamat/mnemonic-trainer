import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffItem, EvaluationResult } from '../../../core/models/game.models';
import { CardVisualComponent } from '../card-visual/card-visual.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-evaluation-diff',
  standalone: true,
  imports: [CommonModule, CardVisualComponent],
  template: `
    @if (result) {
      <div class="eval-container panel">
        @if (result.isPersonalBest) {
          <div class="personal-best-banner">🏆 New personal best — well done!</div>
        }

        <!-- Hero Score Banner -->
        <div class="score-hero">
          <div class="metric-card score-main">
            <span class="metric-label">Accuracy</span>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ result.accuracy }}%</span>
              <span class="metric-sub">{{ result.totalCorrect }} / {{ result.totalItems }} correct</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Time</span>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ formattedDuration }}</span>
              <span class="metric-sub">Spent memorising</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Speed</span>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ result.speedDpm }}</span>
              <span class="metric-sub">{{ speedUnit }}</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Score</span>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ result.score }}</span>
              <span class="metric-sub">Accuracy × speed</span>
            </div>
          </div>
        </div>

        <!-- Diff Breakdown Matrix -->
        <div class="diff-section">
          <div class="section-header">
            <h3 class="section-title">Your answers</h3>
            <div class="diff-legend">
              <span class="legend-item"><span class="dot match"></span> Correct</span>
              <span class="legend-item"><span class="dot error"></span> Wrong</span>
              <span class="legend-item"><span class="dot missing"></span> Missing</span>
              @if (result.discipline === 'words') {
                <span class="legend-item"><span class="dot fuzzy"></span> Close (small typo)</span>
              }
            </div>
          </div>

          <!-- Diff Grid -->
          @if (result.discipline === 'numbers') {
            <div class="numbers-diff-grid">
              @for (item of result.diffBreakdown; track item.index) {
                <div
                  class="diff-cell"
                  [class.cell-correct]="item.status === 'correct'"
                  [class.cell-incorrect]="item.status === 'incorrect'"
                  [class.cell-missing]="item.status === 'missing'"
                >
                  <span class="diff-index font-mono">{{ item.index + 1 }}</span>
                  <span class="diff-expected font-mono">{{ item.expected }}</span>
                  <span class="diff-actual font-mono">{{ item.actual }}</span>
                </div>
              }
            </div>
          } @else if (result.discipline === 'cards') {
            <div class="cards-diff-grid">
              @for (item of result.diffBreakdown; track item.index) {
                <div
                  class="card-diff-item"
                  [class.cell-correct]="item.status === 'correct'"
                  [class.cell-incorrect]="item.status === 'incorrect'"
                  [class.cell-missing]="item.status === 'missing'"
                >
                  <div class="diff-index-badge">{{ item.index + 1 }}</div>
                  <div class="cards-pair">
                    <div class="pair-col">
                      <span class="pair-tag">Correct</span>
                      <app-card-visual [card]="item.expected" [compact]="true"></app-card-visual>
                    </div>
                    <div class="pair-col">
                      <span class="pair-tag">Yours</span>
                      <app-card-visual [card]="item.actual" [compact]="true"></app-card-visual>
                    </div>
                  </div>
                  <div class="status-pill font-mono">
                    {{ statusLabel(item.status) }}
                  </div>
                </div>
              }
            </div>
          } @else if (result.discipline === 'words') {
            <div class="words-diff-grid">
              @for (item of result.diffBreakdown; track item.index) {
                <div
                  class="word-diff-card"
                  [class.cell-correct]="item.status === 'correct'"
                  [class.cell-incorrect]="item.status === 'incorrect'"
                  [class.cell-fuzzy]="item.status === 'fuzzy'"
                  [class.cell-missing]="item.status === 'missing'"
                >
                  <div class="word-idx">{{ item.index + 1 }}</div>
                  <div class="word-content">
                    <div class="word-expected">
                      <span class="tag">Correct</span>
                      <span class="val">{{ item.expected }}</span>
                    </div>
                    <div class="word-actual">
                      <span class="tag">Yours</span>
                      <span class="val">{{ item.actual }}</span>
                    </div>
                    @if (item.details) {
                      <div class="word-details">{{ item.details }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Actions -->
        <div class="eval-actions">
          <button class="btn-primary" (click)="retry.emit()">
            Try again
          </button>
          <button class="btn-secondary" (click)="toConfig.emit()">
            Change settings
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .eval-container {
      padding: 28px;
      max-width: 1000px;
      margin: 0 auto;
      animation: fadeIn 0.2s ease-out;
    }

    .personal-best-banner {
      margin-bottom: 20px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      background: var(--warning-soft);
      color: var(--text);
      font-weight: 700;
      text-align: center;
    }

    .score-hero {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: var(--surface-2);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .metric-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-3);
      }

      .metric-value-wrap {
        display: flex;
        flex-direction: column;
      }

      .metric-value {
        font-family: var(--font-mono);
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.15;
      }

      .metric-sub {
        font-size: 0.85rem;
        color: var(--text-2);
      }
    }

    .diff-section {
      margin-bottom: 28px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 14px;

      .section-title {
        font-size: 1.15rem;
      }
    }

    .diff-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--text-2);
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;

        &.match { background: var(--success); }
        &.error { background: var(--danger); }
        &.missing { background: var(--text-3); }
        &.fuzzy { background: var(--warning); }
      }
    }

    .numbers-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
      gap: 6px;
    }

    .diff-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 4px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      font-family: var(--font-mono);

      .diff-index {
        font-size: 0.65rem;
        color: var(--text-3);
      }

      .diff-expected {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text);
      }

      .diff-actual {
        font-size: 0.85rem;
        font-weight: 600;
      }

      &.cell-correct {
        background: var(--success-soft);
        border-color: transparent;

        .diff-actual { color: var(--success); }
      }

      &.cell-incorrect {
        background: var(--danger-soft);
        border-color: transparent;

        .diff-actual { color: var(--danger); text-decoration: line-through; }
      }

      &.cell-missing {
        .diff-actual { color: var(--text-3); }
      }
    }

    .cards-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 10px;
    }

    .card-diff-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);

      .diff-index-badge {
        align-self: flex-start;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-3);
      }

      .cards-pair {
        display: flex;
        gap: 12px;

        .pair-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;

          .pair-tag {
            font-size: 0.75rem;
            color: var(--text-3);
          }
        }
      }

      .status-pill {
        font-family: var(--font-sans);
        font-size: 0.8rem;
        font-weight: 600;
        padding: 2px 10px;
        border-radius: var(--radius-full);
      }

      &.cell-correct .status-pill { background: var(--success-soft); color: var(--success); }
      &.cell-incorrect .status-pill { background: var(--danger-soft); color: var(--danger); }
      &.cell-missing .status-pill { background: var(--surface-2); color: var(--text-3); }
    }

    .words-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
      gap: 8px;
    }

    .word-diff-card {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-left-width: 4px;
      border-radius: var(--radius-md);
      background: var(--surface);

      .word-idx {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-3);
        min-width: 24px;
      }

      .word-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;

        .word-expected, .word-actual {
          display: flex;
          gap: 6px;
          align-items: baseline;

          .tag {
            font-size: 0.8rem;
            color: var(--text-3);
            min-width: 52px;
          }

          .val {
            font-weight: 600;
            overflow-wrap: anywhere;
          }
        }

        .word-details {
          font-size: 0.8rem;
          color: var(--text-2);
        }
      }

      &.cell-correct {
        border-left-color: var(--success);

        .word-actual .val { color: var(--success); }
      }

      &.cell-fuzzy {
        border-left-color: var(--warning);

        .word-actual .val { color: var(--warning); }
      }

      &.cell-incorrect {
        border-left-color: var(--danger);

        .word-actual .val { color: var(--danger); text-decoration: line-through; }
      }

      &.cell-missing {
        border-left-color: var(--border-strong);

        .word-actual .val { color: var(--text-3); }
      }
    }

    .eval-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 8px;
    }
  `],
})
export class EvaluationDiffComponent implements OnChanges {
  @Input() result: EvaluationResult | null = null;
  @Output() retry = new EventEmitter<void>();
  @Output() toConfig = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['result'] && this.result?.isPersonalBest) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.3 }, disableForReducedMotion: true });
    }
  }

  get formattedDuration(): string {
    if (!this.result) return '00:00';
    const ms = this.result.durationMs;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get speedUnit(): string {
    if (!this.result) return 'Per minute';
    switch (this.result.discipline) {
      case 'numbers': return 'Digits per minute';
      case 'cards': return 'Cards per minute';
      case 'words': return 'Words per minute';
      default: return 'Per minute';
    }
  }

  statusLabel(status: DiffItem['status']): string {
    switch (status) {
      case 'correct': return 'Correct';
      case 'incorrect': return 'Wrong';
      case 'fuzzy': return 'Close';
      case 'missing': return 'Missing';
    }
  }
}
