import { Component, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../../../core/store/game.store';
import { TimerDisplayComponent } from '../../../../shared/components/timer-display/timer-display.component';
import { PaoHintBarComponent } from '../../../../shared/components/pao-hint-bar/pao-hint-bar.component';

@Component({
  selector: 'app-numbers-memorize',
  standalone: true,
  imports: [CommonModule, TimerDisplayComponent, PaoHintBarComponent],
  template: `
    <div class="memorize-container">
      <!-- Top HUD -->
      <div class="hud-bar glass-panel">
        <div class="hud-col">
          <span class="hud-label">LOCUS PROGRESS</span>
          <span class="hud-val font-mono">
            {{ store.activeLocusIndex() + 1 }} <span class="total">/ {{ store.totalLoci() }}</span>
          </span>
        </div>

        <app-timer-display
          [milliseconds]="store.timerMs()"
          [isRunning]="store.isTimerRunning()"
          label="MEMORIZE"
        ></app-timer-display>

        <div class="hud-actions">
          <button class="btn-secondary btn-sm" (click)="store.togglePaoHints()">
            {{ store.enablePaoHints() ? '🧩 Hide PAO' : '🧩 Show PAO' }}
          </button>
          <button class="btn-primary btn-sm recall-btn" (click)="store.startRecall()">
            Finish & Recall ➔
          </button>
        </div>
      </div>

      <!-- Main Focus Display Area -->
      <div class="main-locus-display glass-panel">
        <div class="active-locus-hero">
          <span class="locus-bracket">[</span>
          <span class="locus-digits font-mono">{{ store.activeLocusContent() }}</span>
          <span class="locus-bracket">]</span>
        </div>
        <div class="locus-sub">Locus #{{ store.activeLocusIndex() + 1 }}</div>
      </div>

      <!-- Live PAO Assistant Overlay -->
      @if (store.enablePaoHints() && store.currentPaoHint()) {
        <app-pao-hint-bar [pao]="store.currentPaoHint()"></app-pao-hint-bar>
      }

      <!-- Full Sequence Stream Overview -->
      <div class="sequence-stream-wrap glass-panel">
        <div class="stream-title">SEQUENCE LOCI TRAIL</div>
        <div class="stream-grid">
          @for (locus of store.targetLoci(); track $index) {
            <button
              class="locus-chunk"
              [class.active-locus]="$index === store.activeLocusIndex()"
              [class.past-locus]="$index < store.activeLocusIndex()"
              [class.future-locus]="$index > store.activeLocusIndex()"
              (click)="store.setLocus($index)"
            >
              {{ locus }}
            </button>
          }
        </div>
      </div>

      <!-- Navigation & Hotkeys Legend -->
      <div class="controls-legend">
        <div class="legend-keys">
          <span class="key-pill">Space</span> / <span class="key-pill">➔</span> Advance
          <span class="divider">|</span>
          <span class="key-pill">⬅</span> Previous
          <span class="divider">|</span>
          <span class="key-pill">Enter</span> Finish
        </div>
        <div class="nav-buttons-mobile">
          <button class="btn-secondary" (click)="store.prevLocus()" [disabled]="store.activeLocusIndex() === 0">
            ⬅ Prev
          </button>
          <button class="btn-primary" (click)="store.nextLocus()">
            Next (Space) ➔
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .memorize-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.25s ease-out;
    }

    .hud-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
    }

    .hud-col {
      display: flex;
      flex-direction: column;

      .hud-label {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
      }

      .hud-val {
        font-size: 1.4rem;
        font-weight: 800;
        color: var(--accent-cyan);

        .total {
          font-size: 1rem;
          color: var(--text-muted);
        }
      }
    }

    .hud-actions {
      display: flex;
      gap: 10px;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.85rem;
    }

    .recall-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .main-locus-display {
      padding: 48px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-accent);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.12);
    }

    .active-locus-hero {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .locus-bracket {
        font-family: var(--font-mono);
        font-size: 4.5rem;
        font-weight: 300;
        color: var(--accent-cyan);
        opacity: 0.6;
      }

      .locus-digits {
        font-size: 5.5rem;
        font-weight: 900;
        letter-spacing: 0.15em;
        color: #ffffff;
        text-shadow: 0 0 30px var(--accent-cyan-glow);
      }
    }

    .locus-sub {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .sequence-stream-wrap {
      padding: 20px;
      background: var(--bg-base);

      .stream-title {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .stream-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .controls-legend {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);

      .legend-keys {
        font-size: 0.85rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;

        .key-pill {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--accent-cyan);
        }

        .divider {
          color: var(--border-subtle);
        }
      }

      .nav-buttons-mobile {
        display: flex;
        gap: 8px;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class NumbersMemorizeComponent {
  readonly store = inject(GameStore);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.store.phase() !== 'MEMORIZE') return;

    if (event.code === 'Space' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.store.nextLocus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.store.prevLocus();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.store.startRecall();
    }
  }
}
