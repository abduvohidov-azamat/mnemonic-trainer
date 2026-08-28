import { Component, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../../../core/store/game.store';
import { TimerDisplayComponent } from '../../../../shared/components/timer-display/timer-display.component';
import { CardVisualComponent } from '../../../../shared/components/card-visual/card-visual.component';
import { PaoHintBarComponent } from '../../../../shared/components/pao-hint-bar/pao-hint-bar.component';
import { CardItem } from '../../../../core/models/game.models';

@Component({
  selector: 'app-cards-memorize',
  standalone: true,
  imports: [CommonModule, TimerDisplayComponent, CardVisualComponent, PaoHintBarComponent],
  template: `
    <div class="memorize-container">
      <!-- HUD -->
      <div class="hud-bar glass-panel">
        <div class="hud-col">
          <span class="hud-label">CARDS PROGRESS</span>
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
            Recall Phase ➔
          </button>
        </div>
      </div>

      <!-- Active Card Stage -->
      <div class="card-stage glass-panel">
        <div class="cards-display-row">
          @if (isChunkArray()) {
            @for (card of activeCardsList(); track card.key) {
              <div class="card-wrapper animate-flip">
                <app-card-visual [card]="card"></app-card-visual>
              </div>
            }
          } @else {
            <div class="card-wrapper animate-flip">
              <app-card-visual [card]="singleActiveCard()"></app-card-visual>
            </div>
          }
        </div>
        <div class="stage-sub">Locus #{{ store.activeLocusIndex() + 1 }}</div>
      </div>

      <!-- PAO Assistant -->
      @if (store.enablePaoHints() && store.currentPaoHint()) {
        <app-pao-hint-bar [pao]="store.currentPaoHint()"></app-pao-hint-bar>
      }

      <!-- Mini Deck Strip Navigation -->
      <div class="deck-strip glass-panel">
        <div class="strip-header">DECK LOCI</div>
        <div class="strip-items">
          @for (locus of store.targetLoci(); track $index) {
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
          <span class="key-pill">Space</span> / <span class="key-pill">➔</span> Next Card
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

    .card-stage {
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-accent);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.12);
    }

    .cards-display-row {
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: center;
    }

    .stage-sub {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .deck-strip {
      padding: 18px;
      background: var(--bg-base);

      .strip-header {
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
export class CardsMemorizeComponent {
  readonly store = inject(GameStore);

  isChunkArray(): boolean {
    const content = this.store.activeLocusContent();
    return Array.isArray(content);
  }

  activeCardsList(): CardItem[] {
    const content = this.store.activeLocusContent();
    return Array.isArray(content) ? content : [];
  }

  singleActiveCard(): CardItem | null {
    const content = this.store.activeLocusContent();
    return content && !Array.isArray(content) ? content : null;
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
