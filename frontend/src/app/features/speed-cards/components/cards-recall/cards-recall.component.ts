import { Component, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../../../core/store/game.store';
import { CardItem } from '../../../../core/models/game.models';
import { CardVisualComponent } from '../../../../shared/components/card-visual/card-visual.component';

@Component({
  selector: 'app-cards-recall',
  standalone: true,
  imports: [CommonModule, CardVisualComponent],
  template: `
    <div class="recall-container">
      <div class="recall-header panel">
        <div class="header-info">
          <h2 class="title">Put the cards back in order</h2>
          <p class="desc">Pick a card below to place it in position {{ activeSlot + 1 }}. Click any position to change it.</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="undoLast()">Undo</button>
          <button class="btn-primary submit-btn" (click)="onSubmit()">Check my answers</button>
        </div>
      </div>

      <!-- Placed Cards Tray -->
      <div class="placed-tray-wrap panel">
        <div class="tray-title">Your order ({{ placedCount() }} of {{ totalSlots }} placed)</div>
        <div class="tray-slots">
          @for (slot of slotsArray; track $index) {
            <div
              class="tray-slot"
              [class.active-slot]="$index === activeSlot"
              (click)="selectSlot($index)"
            >
              <div class="slot-num font-mono">{{ $index + 1 }}</div>
              @if (placedCards[$index]) {
                <app-card-visual [card]="placedCards[$index]" [compact]="true"></app-card-visual>
              } @else {
                <div class="empty-slot-card">?</div>
              }
            </div>
          }
        </div>
      </div>

      <!-- 52-Card Interactive Picker -->
      <div class="card-picker-panel panel">
        <!-- Suit Tabs -->
        <div class="suit-tabs">
          @for (suit of suits; track suit.code) {
            <button
              class="suit-tab-btn"
              [class.active]="selectedSuit === suit.code"
              [class.red]="suit.color === 'red'"
              (click)="selectedSuit = suit.code"
            >
              <span class="suit-icon">{{ suit.symbol }}</span>
              <span>{{ suit.name }}</span>
            </button>
          }
        </div>

        <!-- 13 Ranks Grid for selected suit -->
        <div class="ranks-grid">
          @for (rank of ranks; track rank) {
            @let card = getCard(rank, selectedSuit);
            <button
              class="rank-pick-btn"
              [class.red]="card.suitColor === 'red'"
              (click)="pickCard(card)"
            >
              <span class="rank-char">{{ rank }}</span>
              <span class="rank-suit">{{ card.suitSymbol }}</span>
            </button>
          }
        </div>
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

    .placed-tray-wrap {
      padding: 18px 20px;

      .tray-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-2);
        margin-bottom: 10px;
      }

      .tray-slots {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 280px;
        overflow-y: auto;
        padding: 4px;
      }
    }

    .tray-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-md);
      border: 2px solid transparent;
      transition: border-color var(--transition-fast), background-color var(--transition-fast);

      .slot-num {
        font-size: 0.7rem;
        color: var(--text-3);
      }

      &:hover {
        background: var(--surface-2);
      }

      &.active-slot {
        border-color: var(--accent);
        background: var(--accent-soft);
      }
    }

    .empty-slot-card {
      width: 70px;
      height: 100px;
      border: 2px dashed var(--border-strong);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-3);
      font-size: 1.2rem;
      font-weight: 700;
    }

    .card-picker-panel {
      padding: 20px;
    }

    .suit-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      background: var(--surface-2);
      padding: 4px;
      border-radius: var(--radius-md);
    }

    .suit-tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      background: none;
      border: 1px solid transparent;
      color: var(--text-2);
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background-color var(--transition-fast), color var(--transition-fast);

      .suit-icon {
        font-size: 1.1rem;
      }

      &.red .suit-icon {
        color: var(--suit-red);
      }

      &.active {
        background: var(--surface);
        border-color: var(--border);
        color: var(--text);
        box-shadow: var(--shadow-sm);
      }
    }

    .ranks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 8px;
    }

    .rank-pick-btn {
      height: 68px;
      background: var(--card-face);
      color: var(--card-ink);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      cursor: pointer;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &.red {
        color: var(--suit-red);
      }

      .rank-char {
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1;
      }

      .rank-suit {
        font-size: 1rem;
        line-height: 1;
      }

      &:hover {
        border-color: var(--accent);
        box-shadow: var(--shadow-md);
      }
    }
  `],
})
export class CardsRecallComponent implements OnInit {
  readonly store = inject(GameStore);
  @Output() submitRecall = new EventEmitter<CardItem[]>();

  placedCards: (CardItem | null)[] = [];
  activeSlot = 0;
  totalSlots = 52;
  slotsArray: number[] = [];

  selectedSuit: 'S' | 'H' | 'D' | 'C' = 'S';

  suits = [
    { code: 'S' as const, name: 'Spades', symbol: '♠', color: 'black' },
    { code: 'H' as const, name: 'Hearts', symbol: '♥', color: 'red' },
    { code: 'D' as const, name: 'Diamonds', symbol: '♦', color: 'red' },
    { code: 'C' as const, name: 'Clubs', symbol: '♣', color: 'black' },
  ];

  ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  ngOnInit() {
    const rawTarget = this.store.targetSequence();
    this.totalSlots = Array.isArray(rawTarget) ? rawTarget.length : 52;
    this.slotsArray = Array.from({ length: this.totalSlots }, (_, i) => i);
    this.placedCards = Array(this.totalSlots).fill(null);
  }

  placedCount(): number {
    return this.placedCards.filter(Boolean).length;
  }

  selectSlot(index: number) {
    if (index >= 0 && index < this.totalSlots) {
      this.activeSlot = index;
    }
  }

  getCard(rank: string, suitCode: 'S' | 'H' | 'D' | 'C'): CardItem {
    const suitMeta = this.suits.find((s) => s.code === suitCode)!;
    return {
      key: `${rank}${suitCode}`,
      suit: suitCode,
      suitName: suitMeta.name,
      suitSymbol: suitMeta.symbol,
      suitColor: suitMeta.color as 'black' | 'red',
      rank,
      name: `${rank} of ${suitMeta.name}`,
    };
  }

  pickCard(card: CardItem) {
    this.placedCards[this.activeSlot] = card;
    if (this.activeSlot < this.totalSlots - 1) {
      this.activeSlot++;
    }
  }

  undoLast() {
    if (this.placedCards[this.activeSlot]) {
      this.placedCards[this.activeSlot] = null;
    } else if (this.activeSlot > 0) {
      this.activeSlot--;
      this.placedCards[this.activeSlot] = null;
    }
  }

  onSubmit() {
    const cleanRecall = this.placedCards.map((c) => (c ? c : { key: '', name: 'Empty' } as any));
    this.submitRecall.emit(cleanRecall);
  }
}
