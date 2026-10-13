import { Component, OnInit, Output, EventEmitter, inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStore } from '../../../../core/store/game.store';

@Component({
  selector: 'app-words-recall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recall-container">
      <div class="recall-header panel">
        <div class="header-info">
          <h2 class="title">Type the words you remember</h2>
          <p class="desc">Write each word in its position. Press Enter to move to the next box.</p>
        </div>
        <button class="btn-primary submit-btn" (click)="onSubmit()">
          Check my answers
        </button>
      </div>

      <!-- Words Recall Form List -->
      <div class="words-recall-grid panel">
        @for (item of wordsArray; track $index) {
          <div class="word-input-row" [class.focused]="$index === focusedIndex">
            <span class="locus-badge font-mono">{{ $index + 1 }}</span>
            <input
              #wordInput
              type="text"
              [(ngModel)]="recalledWords[$index]"
              (focus)="focusedIndex = $index"
              (keydown)="onKeyDown($event, $index)"
              placeholder="Word {{ $index + 1 }}"
              class="word-input"
            />
          </div>
        }
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

    .words-recall-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
      gap: 10px;
      padding: 20px;
      max-height: 520px;
      overflow-y: auto;
    }

    .word-input-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      .locus-badge {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-3);
        min-width: 28px;
      }

      .word-input {
        flex: 1;
        min-width: 0;
        background: none;
        border: none;
        color: var(--text);
        font-size: 1rem;

        &::placeholder {
          color: var(--text-3);
        }

        &:focus {
          outline: none;
          box-shadow: none;
        }
      }

      &.focused {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
    }
  `],
})
export class WordsRecallComponent implements OnInit {
  readonly store = inject(GameStore);
  @ViewChildren('wordInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Output() submitRecall = new EventEmitter<string[]>();

  recalledWords: string[] = [];
  wordsArray: number[] = [];
  focusedIndex = 0;

  ngOnInit() {
    const rawTarget = this.store.targetSequence();
    const count = Array.isArray(rawTarget) ? rawTarget.length : 20;
    this.wordsArray = Array.from({ length: count }, (_, i) => i);
    this.recalledWords = Array(count).fill('');

    setTimeout(() => {
      this.focusInput(0);
    }, 100);
  }

  focusInput(index: number) {
    if (index >= 0 && index < this.wordsArray.length) {
      this.focusedIndex = index;
      const arr = this.inputs?.toArray();
      if (arr && arr[index]) {
        arr[index].nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (index < this.wordsArray.length - 1) {
        this.focusInput(index + 1);
      } else {
        this.onSubmit();
      }
    }
  }

  onSubmit() {
    this.submitRecall.emit(this.recalledWords);
  }
}
