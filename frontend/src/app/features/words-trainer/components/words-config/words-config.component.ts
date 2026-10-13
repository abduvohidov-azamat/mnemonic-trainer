import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordsConfig } from '../../../../core/models/game.models';

@Component({
  selector: 'app-words-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-card panel">
      <div class="config-header">
        <div class="discipline-badge">
          Words
        </div>
        <h2 class="title">Set up your drill</h2>
        <p class="subtitle">Choose how many words to memorise. Small spelling mistakes still earn partial credit.</p>
      </div>

      <div class="config-grid">
        <!-- Word Count -->
        <div class="setting-block">
          <label class="setting-label">How many words</label>
          <div class="preset-pills">
            @for (preset of [10, 20, 30, 50]; track preset) {
              <button
                class="pill-btn"
                [class.active]="count === preset"
                (click)="count = preset"
              >
                {{ preset }} words
              </button>
            }
          </div>
        </div>

        <!-- Pacer Speed -->
        <div class="setting-block">
          <label class="setting-label">Moving through the words</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 0"
              (click)="autoPacerMs = 0"
            >
              At my own pace
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 2500"
              (click)="autoPacerMs = 2500"
            >
              Every 2.5 seconds
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 1500"
              (click)="autoPacerMs = 1500"
            >
              Every 1.5 seconds
            </button>
          </div>
        </div>
      </div>

      <!-- Start Button -->
      <div class="config-footer">
        <button class="btn-primary start-btn" (click)="onStart()">
          Start memorising
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
  `],
})
export class WordsConfigComponent {
  count = 20;
  autoPacerMs = 0;

  @Output() start = new EventEmitter<WordsConfig>();

  onStart() {
    this.start.emit({
      count: this.count,
      autoPacerMs: this.autoPacerMs,
    });
  }
}
