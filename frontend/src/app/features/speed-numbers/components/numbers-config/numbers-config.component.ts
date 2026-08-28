import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumbersConfig } from '../../../../core/models/game.models';

@Component({
  selector: 'app-numbers-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-card glass-panel">
      <div class="config-header">
        <div class="discipline-badge">
          <span class="icon">🔢</span> SPEED NUMBERS
        </div>
        <h2 class="title">Discipline Configuration</h2>
        <p class="subtitle">Train digit chunking, phonetic translation, and rapid locus indexing.</p>
      </div>

      <div class="config-grid">
        <!-- Digit Count Preset & Custom -->
        <div class="setting-block">
          <label class="setting-label">Total Digits</label>
          <div class="preset-pills">
            @for (preset of [20, 50, 100, 200, 500]; track preset) {
              <button
                class="pill-btn"
                [class.active]="count === preset"
                (click)="count = preset"
              >
                {{ preset }}
              </button>
            }
          </div>
        </div>

        <!-- Chunk Size (Locus grouping) -->
        <div class="setting-block">
          <label class="setting-label">Digits per Locus (Chunk Size)</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="chunkSize === 1"
              (click)="chunkSize = 1"
            >
              1 Digit (Single)
            </button>
            <button
              class="pill-btn"
              [class.active]="chunkSize === 2"
              (click)="chunkSize = 2"
            >
              2 Digits (Standard PAO)
            </button>
            <button
              class="pill-btn"
              [class.active]="chunkSize === 3"
              (click)="chunkSize = 3"
            >
              3 Digits (Advanced)
            </button>
          </div>
        </div>

        <!-- Auto-Pacer Speed -->
        <div class="setting-block">
          <label class="setting-label">Navigation & Pacing</label>
          <div class="preset-pills">
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 0"
              (click)="autoPacerMs = 0"
            >
              Manual Keyboard (Space/Arrows)
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 2000"
              (click)="autoPacerMs = 2000"
            >
              Pacer 2.0s
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 1200"
              (click)="autoPacerMs = 1200"
            >
              Pacer 1.2s (Fast)
            </button>
            <button
              class="pill-btn"
              [class.active]="autoPacerMs === 750"
              (click)="autoPacerMs = 750"
            >
              Pacer 750ms (Athlete)
            </button>
          </div>
        </div>

        <!-- Live PAO Assistant Toggle -->
        <div class="setting-block toggle-block">
          <div class="toggle-info">
            <span class="toggle-title">Live PAO Matrix Hints</span>
            <span class="toggle-desc">Display mapped Person, Action, and Object during memorization.</span>
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
          <span>⚡ Launch Memorization</span>
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
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(0, 240, 255, 0.15);
        color: var(--accent-cyan);
        border-color: var(--accent-cyan);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
      }
    }

    .toggle-block {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-surface);
      padding: 16px 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);

      .toggle-info {
        display: flex;
        flex-direction: column;

        .toggle-title {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .toggle-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      }
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 26px;

      input { opacity: 0; width: 0; height: 0; }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: var(--bg-surface-elevated);
        border: 1px solid var(--border-subtle);
        transition: .3s;
        border-radius: 34px;

        &::before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
      }

      input:checked + .slider {
        background-color: var(--accent-cyan);
        border-color: var(--accent-cyan);
      }

      input:checked + .slider:before {
        transform: translateX(24px);
        background-color: #040914;
      }
    }

    .start-btn {
      width: 100%;
      padding: 16px;
      font-size: 1.1rem;
    }
  `],
})
export class NumbersConfigComponent {
  count = 20;
  chunkSize = 2;
  autoPacerMs = 0;
  enablePaoHints = true;

  @Output() start = new EventEmitter<NumbersConfig>();

  onStart() {
    this.start.emit({
      count: this.count,
      chunkSize: this.chunkSize,
      autoPacerMs: this.autoPacerMs,
      enablePaoHints: this.enablePaoHints,
    });
  }
}
