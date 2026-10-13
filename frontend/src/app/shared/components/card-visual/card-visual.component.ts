import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardItem } from '../../../core/models/game.models';

@Component({
  selector: 'app-card-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (card) {
      <div
        class="playing-card"
        [class.red]="card.suitColor === 'red'"
        [class.black]="card.suitColor === 'black'"
        [class.compact]="compact"
        [class.selected]="selected"
      >
        <!-- Top Left Corner -->
        <div class="card-corner top-left">
          <span class="rank">{{ card.rank }}</span>
          <span class="suit">{{ card.suitSymbol }}</span>
        </div>

        <!-- Center Emblem -->
        <div class="card-center">
          <span class="large-suit">{{ card.suitSymbol }}</span>
        </div>

        <!-- Bottom Right Corner -->
        <div class="card-corner bottom-right">
          <span class="rank">{{ card.rank }}</span>
          <span class="suit">{{ card.suitSymbol }}</span>
        </div>
      </div>
    } @else {
      <div class="card-placeholder" [class.compact]="compact">
        <span>?</span>
      </div>
    }
  `,
  styles: [`
    .playing-card {
      width: 140px;
      height: 200px;
      background: var(--card-face);
      color: var(--card-ink);
      border: 1px solid var(--border-strong);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px;
      position: relative;
      user-select: none;

      &.red {
        color: var(--suit-red);
      }

      &.selected {
        outline: 3px solid var(--accent);
        outline-offset: 2px;
      }

      &.compact {
        width: 70px;
        height: 100px;
        border-radius: 8px;
        padding: 6px;
        box-shadow: var(--shadow-sm);

        .card-corner {
          .rank {
            font-size: 0.85rem;
          }

          .suit {
            font-size: 0.75rem;
          }
        }

        .large-suit {
          font-size: 1.8rem;
        }
      }
    }

    .card-corner {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;

      .rank {
        font-size: 1.3rem;
        font-weight: 700;
      }

      .suit {
        font-size: 1.1rem;
      }

      &.bottom-right {
        transform: rotate(180deg);
      }
    }

    .card-center {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .large-suit {
        font-size: 3.5rem;
      }
    }

    .card-placeholder {
      width: 140px;
      height: 200px;
      border: 2px dashed var(--border-strong);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-3);
      font-size: 2rem;
      font-weight: 700;

      &.compact {
        width: 70px;
        height: 100px;
        border-radius: 8px;
        font-size: 1.2rem;
      }
    }
  `],
})
export class CardVisualComponent {
  @Input() card: CardItem | null = null;
  @Input() compact = false;
  @Input() selected = false;
}
