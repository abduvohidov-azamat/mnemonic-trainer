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
      <div class="hud-bar panel">
        <div class="hud-col">
          <span class="hud-label">Word</span>
          <span class="hud-val font-mono">
            {{ store.activeLocusIndex() + 1 }} <span class="total">/ {{ store.totalLoci() }}</span>
          </span>
        </div>

        <app-timer-display
          [milliseconds]="store.timerMs()"
          [isRunning]="store.isTimerRunning()"
          label="Memorising"
        ></app-timer-display>

        <button class="btn-primary btn-sm" (click)="store.startRecall()">
          Done, start recall
        </button>
      </div>

      <!-- Active Word Spotlight -->
      <div class="word-spotlight panel">
        <div class="spotlight-badge">Word {{ store.activeLocusIndex() + 1 }} of {{ store.totalLoci() }}</div>
        <div class="word-hero">{{ activeWord() }}</div>
        <div class="spotlight-sub">Picture it vividly at the next stop on your memory route.</div>
      </div>

      <!-- Word Loci Strip -->
      <div class="strip-wrap panel">
        <div class="strip-title">All words — click one to jump to it</div>
        <div class="strip-items">
          @for (word of store.targetSequence(); track $index) {
            <button
              class="locus-chunk font-mono"
              [class.active-locus]="$index === store.activeLocusIndex()"
              [class.past-locus]="$index < store.activeLocusIndex()"
              [class.future-locus]="$index > store.activeLocusIndex()"
              (click)="store.setLocus($index)"
            >
              {{ $index + 1 }}
            </button>
          }
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-legend">
        <div class="legend-keys">
          <span class="key-pill">Space</span> or <span class="key-pill">→</span> next
          <span class="divider">|</span>
          <span class="key-pill">←</span> back
          <span class="divider">|</span>
          <span class="key-pill">Enter</span> finish
        </div>
        <div class="nav-buttons-mobile">
          <button class="btn-secondary" (click)="store.prevLocus()" [disabled]="store.activeLocusIndex() === 0">
            ← Back
          </button>
          <button class="btn-primary" (click)="store.nextLocus()">
            Next →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .memorize-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.2s ease-out;
    }

    .hud-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 14px 20px;
    }

    .hud-col {
      display: flex;
      flex-direction: column;

      .hud-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-3);
      }

      .hud-val {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text);

        .total {
          font-size: 1rem;
          color: var(--text-3);
        }
      }
    }

    .hud-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .strip-wrap {
      padding: 16px 20px;

      .strip-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-3);
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
      gap: 12px;

      .legend-keys {
        font-size: 0.9rem;
        color: var(--text-2);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;

        .key-pill {
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-bottom-width: 2px;
          padding: 1px 7px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text);
        }

        .divider {
          color: var(--border-strong);
          margin: 0 4px;
        }
      }

      .nav-buttons-mobile {
        display: flex;
        gap: 8px;
      }
    }

    .word-spotlight {
      padding: 48px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .spotlight-badge {
        font-size: 0.9rem;
        color: var(--text-3);
      }

      .word-hero {
        font-family: var(--font-sans);
        font-size: clamp(2.5rem, 9vw, 4rem);
        font-weight: 700;
        color: var(--text);
        line-height: 1.1;
        word-break: break-word;
      }

      .spotlight-sub {
        color: var(--text-2);
        font-size: 0.95rem;
      }
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
