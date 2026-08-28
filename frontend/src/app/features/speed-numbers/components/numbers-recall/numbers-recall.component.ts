import { Component, OnInit, ElementRef, ViewChildren, QueryList, inject, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStore } from '../../../../core/store/game.store';
import { KeypadComponent } from '../../../../shared/components/keypad/keypad.component';

@Component({
  selector: 'app-numbers-recall',
  standalone: true,
  imports: [CommonModule, FormsModule, KeypadComponent],
  template: `
    <div class="recall-container">
      <div class="recall-header glass-panel">
        <div class="header-info">
          <span class="badge badge-cyan">RECALL PHASE</span>
          <h2 class="title">Enter Recalled Digits</h2>
          <p class="desc">Type directly with your keyboard or use the on-screen keypad below.</p>
        </div>
        <button class="btn-primary submit-btn" (click)="onSubmit()">
          ✓ Submit Evaluation
        </button>
      </div>

      <!-- Recall Digits Grid -->
      <div class="digits-entry-grid glass-panel">
        @for (locus of locusArray; track $index) {
          <div
            class="recall-locus-cell"
            [class.active-cell]="$index === activeIndex"
            (click)="focusInput($index)"
          >
            <span class="locus-num">#{{ $index + 1 }}</span>
            <input
              #digitInput
              type="text"
              inputmode="numeric"
              maxlength="1"
              [value]="enteredDigits[$index] || ''"
              (input)="onDigitInput($event, $index)"
              (keydown)="onKeyDown($event, $index)"
              class="cell-input font-mono"
            />
          </div>
        }
      </div>

      <!-- On-screen Keypad for convenience -->
      <div class="keypad-wrapper">
        <app-keypad
          (digitPress)="onKeypadDigit($event)"
          (backspacePress)="onKeypadBackspace()"
          (submitPress)="onSubmit()"
        ></app-keypad>
      </div>
    </div>
  `,
  styles: [`
    .recall-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.25s ease-out;
    }

    .recall-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 28px;

      .title {
        font-size: 1.4rem;
        font-weight: 800;
        margin-top: 4px;
      }

      .desc {
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }

    .digits-entry-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(54px, 1fr));
      gap: 10px;
      padding: 24px;
      background: var(--bg-base);
      max-height: 420px;
      overflow-y: auto;
    }

    .recall-locus-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 6px 2px;
      cursor: text;
      transition: all var(--transition-fast);

      .locus-num {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--text-muted);
      }

      .cell-input {
        width: 100%;
        text-align: center;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.4rem;
        font-weight: 800;
        caret-color: var(--accent-cyan);

        &:focus {
          outline: none;
        }
      }

      &.active-cell {
        border-color: var(--accent-cyan);
        background: rgba(0, 240, 255, 0.12);
        box-shadow: 0 0 15px var(--accent-cyan-glow);
        transform: scale(1.05);
      }
    }

    .keypad-wrapper {
      margin-top: 8px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class NumbersRecallComponent implements OnInit {
  readonly store = inject(GameStore);

  @ViewChildren('digitInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Output() submitRecall = new EventEmitter<string>();

  enteredDigits: string[] = [];
  activeIndex = 0;
  locusArray: number[] = [];

  ngOnInit() {
    const totalDigits = (this.store.targetSequence() as string)?.length || 20;
    this.locusArray = Array.from({ length: totalDigits }, (_, i) => i);
    this.enteredDigits = Array(totalDigits).fill('');

    setTimeout(() => {
      this.focusInput(0);
    }, 100);
  }

  focusInput(index: number) {
    if (index >= 0 && index < this.locusArray.length) {
      this.activeIndex = index;
      const inputArr = this.inputs?.toArray();
      if (inputArr && inputArr[index]) {
        inputArr[index].nativeElement.focus();
        inputArr[index].nativeElement.select();
      }
    }
  }

  onDigitInput(event: any, index: number) {
    const val = event.target.value;
    const cleanDigit = val.replace(/\D/g, '').slice(-1);
    this.enteredDigits[index] = cleanDigit;

    if (cleanDigit && index < this.locusArray.length - 1) {
      this.focusInput(index + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.enteredDigits[index] && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.locusArray.length - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onKeypadDigit(digit: string) {
    this.enteredDigits[this.activeIndex] = digit;
    if (this.activeIndex < this.locusArray.length - 1) {
      this.focusInput(this.activeIndex + 1);
    }
  }

  onKeypadBackspace() {
    this.enteredDigits[this.activeIndex] = '';
    if (this.activeIndex > 0) {
      this.focusInput(this.activeIndex - 1);
    }
  }

  onSubmit() {
    const recallStr = this.enteredDigits.join('');
    this.submitRecall.emit(recallStr);
  }
}
