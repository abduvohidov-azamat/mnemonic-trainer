import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationResult } from '../../../core/models/game.models';
import { CardVisualComponent } from '../card-visual/card-visual.component';

@Component({
  selector: 'app-evaluation-diff',
  standalone: true,
  imports: [CommonModule, CardVisualComponent],
  template: `
    @if (result) {
      <div class="eval-container glass-panel">
        <!-- Hero Score Banner -->
        <div class="score-hero">
          <div class="metric-card score-main">
            <span class="metric-label">ACCURACY</span>
            <div class="metric-value-wrap">
              <span class="metric-value text-cyan">{{ result.accuracy }}%</span>
              <span class="metric-sub">{{ result.totalCorrect }} / {{ result.totalItems }} correct</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">TIME</span>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ formattedDuration }}</span>
              <span class="metric-sub">Memorization</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">SPEED</span>
            <div class="metric-value-wrap">
              <span class="metric-value text-amber">{{ result.speedDpm }}</span>
              <span class="metric-sub">{{ speedUnit }}</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">ATHLETE SCORE</span>
            <div class="metric-value-wrap">
              <span class="metric-value text-emerald">{{ result.score }}</span>
              <span class="metric-sub">Points</span>
            </div>
          </div>
        </div>

        <!-- Diff Breakdown Matrix -->
        <div class="diff-section">
          <div class="section-header">
            <h3 class="section-title">Sequence Diff Analysis</h3>
            <div class="diff-legend">
              <span class="legend-item"><span class="dot match"></span> Correct Match</span>
              <span class="legend-item"><span class="dot error"></span> Error</span>
              <span class="legend-item"><span class="dot missing"></span> Missing</span>
              @if (result.discipline === 'words') {
                <span class="legend-item"><span class="dot fuzzy"></span> Typo Tolerance (Fuzzy)</span>
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
                  <span class="diff-index font-mono">#{{ item.index + 1 }}</span>
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
                  <div class="diff-index-badge">#{{ item.index + 1 }}</div>
                  <div class="cards-pair">
                    <div class="pair-col">
                      <span class="pair-tag">Expected</span>
                      <app-card-visual [card]="item.expected" [compact]="true"></app-card-visual>
                    </div>
                    <div class="pair-col">
                      <span class="pair-tag">Recalled</span>
                      <app-card-visual [card]="item.actual" [compact]="true"></app-card-visual>
                    </div>
                  </div>
                  <div class="status-pill font-mono">
                    {{ item.status | uppercase }}
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
                  <div class="word-idx">#{{ item.index + 1 }}</div>
                  <div class="word-content">
                    <div class="word-expected">
                      <span class="tag">TARGET:</span>
                      <span class="val">{{ item.expected }}</span>
                    </div>
                    <div class="word-actual">
                      <span class="tag">RECALL:</span>
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
            <span>⚡ Train Again</span>
          </button>
          <button class="btn-secondary" (click)="toConfig.emit()">
            <span>⚙ Change Settings</span>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .eval-container {
      padding: 32px;
      max-width: 1000px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease-out;
    }

    .score-hero {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 36px;
    }

    .metric-card {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .metric-label {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
      }

      .metric-value {
        font-size: 2.4rem;
        font-weight: 900;
        font-family: var(--font-mono);
        line-height: 1;
      }

      .metric-sub {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }
    }

    .diff-section {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 24px;
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 12px;

      .section-title {
        font-size: 1.1rem;
        font-weight: 800;
      }
    }

    .diff-legend {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.8rem;
      color: var(--text-secondary);

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.match { background: var(--accent-emerald); }
        &.error { background: var(--accent-rose); }
        &.missing { background: var(--text-muted); }
        &.fuzzy { background: var(--accent-amber); }
      }
    }

    // Numbers Diff Grid
    .numbers-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
      gap: 8px;
    }

    .diff-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 4px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);

      .diff-index {
        font-size: 0.65rem;
        color: var(--text-muted);
      }

      .diff-expected {
        font-size: 1.1rem;
        font-weight: 800;
      }

      .diff-actual {
        font-size: 0.9rem;
        font-weight: 700;
      }

      &.cell-correct {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.1);
        .diff-actual { color: var(--accent-emerald); }
      }

      &.cell-incorrect {
        border-color: rgba(244, 63, 94, 0.4);
        background: rgba(244, 63, 94, 0.1);
        .diff-actual { color: var(--accent-rose); text-decoration: line-through; }
      }

      &.cell-missing {
        border-color: rgba(255, 255, 255, 0.1);
        .diff-actual { color: var(--text-muted); }
      }
    }

    // Cards Diff Grid
    .cards-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .card-diff-item {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: relative;

      .diff-index-badge {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--text-muted);
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
            font-size: 0.65rem;
            text-transform: uppercase;
            color: var(--text-muted);
          }
        }
      }

      .status-pill {
        font-size: 0.7rem;
        font-weight: 800;
        padding: 2px 10px;
        border-radius: var(--radius-full);
      }

      &.cell-correct {
        border-color: rgba(16, 185, 129, 0.4);
        .status-pill { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); }
      }

      &.cell-incorrect {
        border-color: rgba(244, 63, 94, 0.4);
        .status-pill { background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); }
      }

      &.cell-missing {
        border-color: rgba(255, 255, 255, 0.1);
        .status-pill { background: rgba(255, 255, 255, 0.05); color: var(--text-muted); }
      }
    }

    // Words Diff Grid
    .words-diff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }

    .word-diff-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      gap: 12px;

      .word-idx {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 800;
        color: var(--text-muted);
      }

      .word-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;

        .word-expected, .word-actual {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;

          .tag { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; }
          .val { font-weight: 700; }
        }

        .word-details {
          font-size: 0.72rem;
          color: var(--accent-amber);
          margin-top: 4px;
        }
      }

      &.cell-correct {
        border-color: rgba(16, 185, 129, 0.4);
        .word-actual .val { color: var(--accent-emerald); }
      }

      &.cell-fuzzy {
        border-color: rgba(255, 183, 3, 0.4);
        .word-actual .val { color: var(--accent-amber); }
      }

      &.cell-incorrect {
        border-color: rgba(244, 63, 94, 0.4);
        .word-actual .val { color: var(--accent-rose); text-decoration: line-through; }
      }

      &.cell-missing {
        border-color: rgba(255, 255, 255, 0.1);
        .word-actual .val { color: var(--text-muted); }
      }
    }

    .eval-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  `],
})
export class EvaluationDiffComponent {
  @Input() result: EvaluationResult | null = null;
  @Output() retry = new EventEmitter<void>();
  @Output() toConfig = new EventEmitter<void>();

  get formattedDuration(): string {
    if (!this.result) return '00:00';
    const ms = this.result.durationMs;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}s`;
  }

  get speedUnit(): string {
    if (!this.result) return 'Items / Min';
    switch (this.result.discipline) {
      case 'numbers': return 'Digits / Min (DPM)';
      case 'cards': return 'Cards / Min (CPM)';
      case 'words': return 'Words / Min (WPM)';
      default: return 'Items / Min';
    }
  }
}
