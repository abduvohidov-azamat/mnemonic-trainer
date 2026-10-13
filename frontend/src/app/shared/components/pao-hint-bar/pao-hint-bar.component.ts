import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaoEntry } from '../../../core/models/pao.models';

@Component({
  selector: 'app-pao-hint-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (pao) {
      <div class="pao-overlay-bar">
        <div class="pao-header">
          <span class="pao-tag">PAO for {{ pao.key }}</span>
          @if (pao.notes) {
            <span class="pao-note">{{ pao.notes }}</span>
          }
        </div>
        <div class="pao-triad">
          <div class="pao-node person">
            <span class="node-label">Person</span>
            <span class="node-val">{{ pao.person || '—' }}</span>
          </div>
          <div class="pao-node action">
            <span class="node-label">Action</span>
            <span class="node-val">{{ pao.action || '—' }}</span>
          </div>
          <div class="pao-node object">
            <span class="node-label">Object</span>
            <span class="node-val">{{ pao.object || '—' }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .pao-overlay-bar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 14px 18px;
      box-shadow: var(--shadow-sm);
      animation: fadeIn 0.15s ease-out;
    }

    .pao-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;

      .pao-tag {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-2);
      }

      .pao-note {
        font-size: 0.85rem;
        color: var(--text-3);
      }
    }

    .pao-triad {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .pao-node {
      display: flex;
      flex-direction: column;
      background: var(--surface-2);
      padding: 8px 12px;
      border-radius: var(--radius-md);

      .node-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-3);
      }

      .node-val {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  `],
})
export class PaoHintBarComponent {
  @Input() pao: PaoEntry | null = null;
}
