import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="keypad-grid">
      @for (d of digits; track d) {
        <button class="key-btn" (click)="digitPress.emit(d)">
          {{ d }}
        </button>
      }
      <button class="key-btn action-key backspace" aria-label="Delete" (click)="backspacePress.emit()">
        ⌫
      </button>
      <button class="key-btn" (click)="digitPress.emit('0')">
        0
      </button>
      <button class="key-btn action-key submit" aria-label="Check my answers" (click)="submitPress.emit()">
        ✓
      </button>
    </div>
  `,
  styles: [`
    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      max-width: 280px;
      margin: 0 auto;
    }

    .key-btn {
      height: 54px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 1.35rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color var(--transition-fast), border-color var(--transition-fast);

      &:hover {
        background: var(--surface-2);
      }

      &:active {
        background: var(--surface-3);
      }

      &.action-key {
        font-family: var(--font-sans);
        font-size: 1.15rem;
      }

      &.submit {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--on-accent);

        &:hover {
          background: var(--accent-hover);
        }
      }
    }
  `],
})
export class KeypadComponent {
  digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  @Output() digitPress = new EventEmitter<string>();
  @Output() backspacePress = new EventEmitter<void>();
  @Output() submitPress = new EventEmitter<void>();
}
