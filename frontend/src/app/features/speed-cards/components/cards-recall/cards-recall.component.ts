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
      <div class="recall-header glass-panel">
        <div class="header-info">
          <span class="badge badge-cyan">DECK RECALL PHASE</span>
          <h2 class="title">Reconstruct the Card Order</h2>
          <p class="desc">Select cards from the picker below into slot #{{ activeSlot + 1 }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary btn-sm" (click)="undoLast()">⌫ Undo</button>
          <button class="btn-primary submit-btn" (click)="onSubmit()">✓ Evaluate Deck</button>
        </div>
      </div>

      <!-- Placed Cards Tray -->
      <div class="placed-tray-wrap glass-panel">
        <div class="tray-title">PLACED SEQUENCE ({{ placedCards.length }} / {{ totalSlots }})</div>
        <div class="tray-slots">
          @for (slot of slotsArray; track $index) {
            <div
              class="tray-slot"
              [class.active-slot]="$index === activeSlot"
              (click)="selectSlot($index)"
            >
              <div class="slot-num font-mono">#{{ $index + 1 }}</div>
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
      <div class="card-picker-panel glass-panel">
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
      gap: 20px;
      max-width: 1000px;
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
      .header-actions { display: flex; gap: 10px; }
    }

    .placed-tray-wrap {
      padding: 20px;
      background: var(--bg-base);

      .tray-title {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .tray-slots {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
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
      border-radius: 8px;
      border: 1px solid transparent;
      transition: all var(--transition-fast);

      .slot-num {
        font-size: 0.65rem;
        color: var(--text-muted);
      }

      &.active-slot {
        border-color: var(--accent-cyan);
        background: rgba(0, 240, 255, 0.1);
        box-shadow: 0 0 15px var(--accent-cyan-glow);
        transform: translateY(-2px);
      }
    }

    .empty-slot-card {
      width: 70px;
      height: 100px;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 1.2rem;
      font-weight: 800;
    }

    .card-picker-panel {
      padding: 24px;
    }

    .suit-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      background: var(--bg-base);
      padding: 4px;
      border-radius: var(--radius-md);
    }

    .suit-tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      .suit-icon { font-size: 1.1rem; }

      &.red { color: #f87171; }

      &.active {
        background: var(--bg-surface-elevated);
        border: 1px solid var(--border-accent);
        color: var(--text-primary);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

        &.red { color: #ef4444; }
      }
    }

    .ranks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
      gap: 10px;
    }

    .rank-pick-btn {
      height: 70px;
      background: #ffffff;
      color: #0f172a;
      border: none;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);

      &.red {
        color: #dc2626;
      }

      .rank-char {
        font-size: 1.2rem;
        font-weight: 900;
        line-height: 1;
      }

      .rank-suit {
        font-size: 1rem;
        line-height: 1;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 240, 255, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
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
