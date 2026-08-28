import { Component, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../../../core/store/game.store';
import { TimerDisplayComponent } from '../../../../shared/components/timer-display/timer-display.component';

@Component({
  selector: 'app-words-memorize',
  standalone: true,
  imports: [CommonModule, TimerDisplayComponent],
  template: `
    <div class="memorize-container">
      <div class="hud-bar glass-panel">
        <div class="hud-col">
          <span class="hud-label">WORD PROGRESS</span>
          <span class="hud-val font-mono">
            {{ store.activeLocusIndex() + 1 }} <span class="total">/ {{ store.totalLoci() }}</span>
          </span>
        </div>

        <app-timer-display
          [milliseconds]="store.timerMs()"
          [isRunning]="store.isTimerRunning()"
          label="MEMORIZE"
        ></app-timer-display>

        <button class="btn-primary btn-sm recall-btn" (click)="store.startRecall()">
          Recall Words ➔
        </button>
      </div>

      <!-- Active Word Spotlight -->
      <div class="word-spotlight glass-panel">
        <div class="spotlight-badge font-mono">LOCUS #{{ store.activeLocusIndex() + 1 }}</div>
        <div class="word-hero font-mono">{{ activeWord() }}</div>
        <div class="spotlight-sub">Visualize this object interacting with locus #{{ store.activeLocusIndex() + 1 }}</div>
      </div>

      <!-- Word Loci Strip -->
      <div class="word-strip glass-panel">
        <div class="strip-title">WORDS TRAIL</div>
        <div class="strip-items">
          @for (word of store.targetSequence(); track $index) {
            <button
              class="locus-chunk font-mono"
              [class.active-locus]="$index === store.activeLocusIndex()"
              [class.past-locus]="$index < store.activeLocusIndex()"
              [class.future-locus]="$index > store.activeLocusIndex()"
              (click)="store.setLocus($index)"
            >
              #{{ $index + 1 }}
            </button>
          }
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-legend">
        <div class="legend-keys">
          <span class="key-pill">Space</span> / <span class="key-pill">➔</span> Next Word
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

    .recall-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .word-spotlight {
      padding: 60px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-accent);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.12);

      .spotlight-badge {
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--accent-cyan);
        letter-spacing: 0.15em;
        margin-bottom: 12px;
      }

      .word-hero {
        font-size: 4rem;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: 0.05em;
        text-shadow: 0 0 30px var(--accent-cyan-glow);
        text-transform: capitalize;
      }

      .spotlight-sub {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-top: 16px;
      }
    }

    .word-strip {
      padding: 18px;
      background: var(--bg-base);

      .strip-title {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        margin-bottom: 10px;
      }

      .strip-items {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
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
export class WordsMemorizeComponent {
  readonly store = inject(GameStore);

  activeWord(): string {
    const raw = this.store.targetSequence();
    const idx = this.store.activeLocusIndex();
    return Array.isArray(raw) && raw[idx] ? raw[idx] : '—';
  }

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
