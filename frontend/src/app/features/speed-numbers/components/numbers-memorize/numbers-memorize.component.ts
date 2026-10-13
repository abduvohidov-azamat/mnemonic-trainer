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
      <div class="hud-bar panel">
        <div class="hud-col">
          <span class="hud-label">Group</span>
          <span class="hud-val font-mono">
            {{ store.activeLocusIndex() + 1 }} <span class="total">/ {{ store.totalLoci() }}</span>
          </span>
        </div>

        <app-timer-display
          [milliseconds]="store.timerMs()"
          [isRunning]="store.isTimerRunning()"
          label="Memorising"
        ></app-timer-display>

        <div class="hud-actions">
          <button class="btn-secondary btn-sm" (click)="store.togglePaoHints()">
            {{ store.enablePaoHints() ? 'Hide hints' : 'Show hints' }}
          </button>
          <button class="btn-primary btn-sm" (click)="store.startRecall()">
            Done, start recall
          </button>
        </div>
      </div>

      <!-- Main Focus Display Area -->
      <div class="main-locus-display panel">
        <div class="active-locus-hero">
          <span class="locus-digits font-mono">{{ store.activeLocusContent() }}</span>
        </div>
        <div class="locus-sub">Group {{ store.activeLocusIndex() + 1 }} of {{ store.totalLoci() }}</div>
      </div>

      <!-- Live PAO Assistant Overlay -->
      @if (store.enablePaoHints() && store.currentPaoHint()) {
        <app-pao-hint-bar [pao]="store.currentPaoHint()"></app-pao-hint-bar>
      }

      <!-- Full Sequence Stream Overview -->
      <div class="strip-wrap panel">
        <div class="strip-title">All groups — click one to jump to it</div>
        <div class="strip-items">
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

    .main-locus-display {
      padding: 48px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .locus-digits {
      font-size: clamp(3.5rem, 12vw, 5.5rem);
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--text);
      line-height: 1.1;
    }

    .locus-sub {
      font-size: 0.95rem;
      color: var(--text-3);
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
