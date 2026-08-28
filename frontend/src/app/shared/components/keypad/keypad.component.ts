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
      <button class="key-btn action-key backspace" (click)="backspacePress.emit()">
        ⌫
      </button>
      <button class="key-btn" (click)="digitPress.emit('0')">
        0
      </button>
      <button class="key-btn action-key submit" (click)="submitPress.emit()">
        ✓
      </button>
    </div>
  `,
  styles: [`
    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      max-width: 280px;
      margin: 0 auto;
    }

    .key-btn {
      height: 56px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 1.4rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

      &:hover {
        background: #232d42;
        border-color: var(--accent-cyan);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(1px);
        background: var(--accent-cyan);
        color: #040914;
      }

      &.action-key {
        font-family: var(--font-sans);
        font-size: 1.2rem;
      }

      &.backspace:hover {
        border-color: var(--accent-rose);
        color: var(--accent-rose);
      }

      &.submit {
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.4);
        color: var(--accent-emerald);

        &:hover {
          background: var(--accent-emerald);
          color: #040914;
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
