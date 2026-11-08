import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardsConfig } from '../../../../core/models/game.models';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-cards-config',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="config-card panel">
      <div class="config-header">
        <div class="discipline-badge">{{ 'common.cards' | t }}</div>
        <h2 class="title">{{ 'config.title' | t }}</h2>
        <p class="subtitle">{{ 'config.cardsSubtitle' | t }}</p>
      </div>

      <div class="config-grid">
        <!-- How many cards -->
        <div class="setting-block">
          <label class="setting-label">{{ 'config.cardsHowMany' | t }}</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="deckSize === 10"
              (click)="deckSize = 10"
            >
              {{ 'config.deck10' | t }}
            </button>
            <button
              class="pill-btn"
              [class.active]="deckSize === 26"
              (click)="deckSize = 26"
            >
              {{ 'config.deck26' | t }}
            </button>
            <button
              class="pill-btn"
              [class.active]="deckSize === 52"
              (click)="deckSize = 52"
            >
              {{ 'config.deck52' | t }}
            </button>
          </div>
        </div>

        <!-- Cards per Locus -->
        <div class="setting-block">
          <label class="setting-label">{{ 'config.cardsGroup' | t }}</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="chunkSize === 1"
              (click)="chunkSize = 1"
            >
              {{ 'config.cards1' | t }}
            </button>
            <button
              class="pill-btn"
              [class.active]="chunkSize === 2"
              (click)="chunkSize = 2"
            >
              {{ 'config.cards2' | t }}
            </button>
          </div>
        </div>

        <!-- Auto-Pacer Speed -->
        <div class="setting-block">
          <label class="setting-label">{{ 'config.cardsPace' | t }}</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 0"
              (click)="autoPacerMs = 0"
            >
              {{ 'config.ownPace' | t }}
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 3000"
              (click)="autoPacerMs = 3000"
            >
              {{ 'config.every' | t: { s: 3 } }}
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 1500"
              (click)="autoPacerMs = 1500"
            >
              {{ 'config.every' | t: { s: 1.5 } }}
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 800"
              (click)="autoPacerMs = 800"
            >
              {{ 'config.every' | t: { s: 0.8 } }}
            </button>
          </div>
        </div>

        <!-- Live PAO Assistant Toggle -->
        <div class="setting-block toggle-block">
          <div class="toggle-info">
            <span class="toggle-title">{{ 'config.hintsTitle' | t }}</span>
            <span class="toggle-desc">{{ 'config.cardsHintsDesc' | t }}</span>
          </div>
          <label class="switch">
            <input type="checkbox" [(ngModel)]="enablePaoHints" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Start Button -->
      <div class="config-footer">
        <button class="btn-primary start-btn" (click)="onStart()">
          {{ 'config.shuffleStart' | t }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .config-card {
      max-width: 760px;
      margin: 0 auto;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .config-header {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .discipline-badge {
        align-self: flex-start;
        padding: 2px 10px;
        border-radius: var(--radius-full);
        background: var(--accent-soft);
        color: var(--accent-ink);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .title {
        font-size: 1.5rem;
      }

      .subtitle {
        color: var(--text-2);
      }
    }

    .config-grid {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .setting-block {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .setting-label {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text);
      }
    }

    .preset-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-btn {
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      color: var(--text-2);
      font-size: 0.95rem;
      font-weight: 600;
      padding: 8px 14px;
      cursor: pointer;
      transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);

      &:hover {
        background: var(--surface-2);
        color: var(--text);
      }

      &.active {
        background: var(--accent-soft);
        border-color: var(--accent);
        color: var(--accent-ink);
      }
    }

    .toggle-block {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 16px;
      background: var(--surface-2);
      border-radius: var(--radius-md);

      .toggle-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .toggle-title {
          font-weight: 600;
        }

        .toggle-desc {
          color: var(--text-2);
          font-size: 0.9rem;
        }
      }
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        inset: 0;
        cursor: pointer;
        background: var(--surface-3);
        border: 1px solid var(--border-strong);
        border-radius: var(--radius-full);
        transition: background-color var(--transition-fast);

        &::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          left: 2px;
          top: 2px;
          background: var(--surface);
          border-radius: 50%;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast);
        }
      }

      input:checked + .slider {
        background: var(--accent);
        border-color: var(--accent);
      }

      input:checked + .slider::before {
        transform: translateX(20px);
      }

      input:focus-visible + .slider {
        box-shadow: var(--focus-ring);
      }
    }

    .config-footer {
      padding-top: 4px;
    }

    .start-btn {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
    }

    @media (max-width: 600px) {
      .config-card {
        padding: 18px 16px;
        gap: 20px;
      }

      .config-header .title {
        font-size: 1.3rem;
      }

      .config-grid {
        gap: 18px;
      }

      .pill-btn {
        padding: 10px 14px;
      }

      .toggle-block {
        padding: 12px 14px;
      }
    }
  `],
})
export class CardsConfigComponent {
  deckSize = 52;
  chunkSize = 1;
  autoPacerMs = 0;
  enablePaoHints = true;

  @Output() start = new EventEmitter<CardsConfig>();

  onStart() {
    this.start.emit({
      deckSize: this.deckSize,
      chunkSize: this.chunkSize,
      autoPacerMs: this.autoPacerMs,
      enablePaoHints: this.enablePaoHints,
    });
  }
}
