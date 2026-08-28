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
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px;
      position: relative;
      user-select: none;
      transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s;
      font-family: var(--font-sans);

      &.red {
        color: #dc2626;
      }

      &.black {
        color: #0f172a;
      }

      &.selected {
        outline: 3px solid var(--accent-cyan);
        box-shadow: 0 0 25px var(--accent-cyan-glow);
        transform: translateY(-6px);
      }

      &.compact {
        width: 70px;
        height: 100px;
        border-radius: 8px;
        padding: 6px;

        .card-corner {
          .rank { font-size: 0.85rem; font-weight: 800; }
          .suit { font-size: 0.75rem; }
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
        font-weight: 900;
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
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;

      .large-suit {
        font-size: 3.5rem;
        opacity: 0.95;
      }
    }

    .card-placeholder {
      width: 140px;
      height: 200px;
      background: rgba(255, 255, 255, 0.04);
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 2rem;
      font-weight: 800;

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
