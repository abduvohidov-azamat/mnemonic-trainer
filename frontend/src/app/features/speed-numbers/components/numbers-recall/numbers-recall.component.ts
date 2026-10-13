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
      <div class="recall-header panel">
        <div class="header-info">
          <h2 class="title">Type the digits you remember</h2>
          <p class="desc">Use your keyboard or the keypad below. Leave a box empty if you can't remember it.</p>
        </div>
        <button class="btn-primary submit-btn" (click)="onSubmit()">
          Check my answers
        </button>
      </div>

      <!-- Recall Digits Grid -->
      <div class="digits-entry-grid panel">
        @for (locus of locusArray; track $index) {
          <div
            class="recall-locus-cell"
            [class.active-cell]="$index === activeIndex"
            (click)="focusInput($index)"
          >
            <span class="locus-num">{{ $index + 1 }}</span>
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
      gap: 16px;
      max-width: 960px;
      margin: 0 auto;
      animation: fadeIn 0.2s ease-out;
    }

    .recall-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 18px 22px;

      .header-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .title {
        font-size: 1.35rem;
      }

      .desc {
        color: var(--text-2);
        font-size: 0.95rem;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }

    .digits-entry-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
      gap: 8px;
      padding: 20px;
      max-height: 420px;
      overflow-y: auto;
    }

    .recall-locus-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      padding: 4px 2px 2px;
      cursor: text;
      transition: border-color var(--transition-fast), background-color var(--transition-fast);

      .locus-num {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--text-3);
      }

      .cell-input {
        width: 100%;
        text-align: center;
        background: none;
        border: none;
        color: var(--text);
        font-family: var(--font-mono);
        font-size: 1.35rem;
        font-weight: 700;
        caret-color: var(--accent);

        &:focus {
          outline: none;
          box-shadow: none;
        }
      }

      &.active-cell {
        border-color: var(--accent);
        background: var(--accent-soft);
        box-shadow: var(--focus-ring);
      }
    }

    .keypad-wrapper {
      margin-top: 4px;
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
    event.target.value = cleanDigit;

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
    const recallStr = this.enteredDigits.map((d) => d || ' ').join('');
    this.submitRecall.emit(recallStr);
  }
}
