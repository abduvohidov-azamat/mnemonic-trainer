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
      <div class="recall-header glass-panel">
        <div class="header-info">
          <span class="badge badge-cyan">WORDS RECALL PHASE</span>
          <h2 class="title">Type Recalled Words</h2>
          <p class="desc">Enter the word associated with each locus. Press Enter to jump to the next input.</p>
        </div>
        <button class="btn-primary submit-btn" (click)="onSubmit()">
          ✓ Submit Evaluation
        </button>
      </div>

      <!-- Words Recall Form List -->
      <div class="words-recall-grid glass-panel">
        @for (item of wordsArray; track $index) {
          <div class="word-input-row" [class.focused]="$index === focusedIndex">
            <span class="locus-badge font-mono">#{{ $index + 1 }}</span>
            <input
              #wordInput
              type="text"
              [(ngModel)]="recalledWords[$index]"
              (focus)="focusedIndex = $index"
              (keydown)="onKeyDown($event, $index)"
              placeholder="Word #{{ $index + 1 }}"
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
      gap: 20px;
      max-width: 840px;
      margin: 0 auto;
      animation: fadeIn 0.25s ease-out;
    }

    .recall-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;

      .title { font-size: 1.3rem; font-weight: 800; }
      .desc { font-size: 0.85rem; color: var(--text-muted); }
    }

    .words-recall-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
      padding: 24px;
      background: var(--bg-base);
      max-height: 480px;
      overflow-y: auto;
    }

    .word-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px 14px;
      transition: all var(--transition-fast);

      .locus-badge {
        font-size: 0.8rem;
        font-weight: 800;
        color: var(--accent-cyan);
        min-width: 32px;
      }

      .word-input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 1rem;
        font-weight: 600;

        &:focus {
          outline: none;
        }
      }

      &.focused {
        border-color: var(--accent-cyan);
        box-shadow: 0 0 15px var(--accent-cyan-glow);
        background: rgba(0, 240, 255, 0.08);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
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
