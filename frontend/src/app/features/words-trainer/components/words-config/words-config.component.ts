import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordsConfig } from '../../../../core/models/game.models';

@Component({
  selector: 'app-words-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-card glass-panel">
      <div class="config-header">
        <div class="discipline-badge">
          <span class="icon">📖</span> RANDOM WORDS
        </div>
        <h2 class="title">Random Words Memory Training</h2>
        <p class="subtitle">Associate abstract & concrete nouns along your memory palace loci with fuzzy typo tolerance.</p>
      </div>

      <div class="config-grid">
        <!-- Word Count -->
        <div class="setting-block">
          <label class="setting-label">Word List Length</label>
          <div class="preset-pills">
            @for (preset of [10, 20, 30, 50]; track preset) {
              <button
                class="pill-btn"
                [class.active]="count === preset"
                (click)="count = preset"
              >
                {{ preset }} Words
              </button>
            }
          </div>
        </div>

        <!-- Pacer Speed -->
        <div class="setting-block">
          <label class="setting-label">Navigation & Pacing</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 0"
              (click)="autoPacerMs = 0"
            >
              Manual Keyboard (Space / Arrows)
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 2500"
              (click)="autoPacerMs = 2500"
            >
              2.5s Pacer
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 1500"
              (click)="autoPacerMs = 1500"
            >
              1.5s Pacer (Fast)
            </button>
          </div>
        </div>
      </div>

      <!-- Start Button -->
      <div class="config-footer">
        <button class="btn-primary start-btn" (click)="onStart()">
          <span>⚡ Generate Words & Begin</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .config-card {
      max-width: 720px;
      margin: 0 auto;
      padding: 36px;
    }

    .config-header {
      margin-bottom: 28px;

      .discipline-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--accent-cyan);
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        margin-bottom: 8px;
      }

      .title {
        font-size: 1.8rem;
        font-weight: 900;
        margin-bottom: 6px;
      }

      .subtitle {
        color: var(--text-secondary);
        font-size: 0.95rem;
      }
    }

    .config-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 36px;
    }

    .setting-block {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .setting-label {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .preset-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 700;
      padding: 10px 18px;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-surface-elevated);
        color: var(--text-primary);
      }

      &.active {
        background: rgba(0, 240, 255, 0.15);
        color: var(--accent-cyan);
        border-color: var(--accent-cyan);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
      }
    }

    .start-btn {
      width: 100%;
      padding: 16px;
      font-size: 1.1rem;
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
