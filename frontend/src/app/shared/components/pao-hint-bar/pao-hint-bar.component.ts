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
          <span class="pao-tag">PAO HELPER [{{ pao.key }}]</span>
          @if (pao.notes) {
            <span class="pao-note">{{ pao.notes }}</span>
          }
        </div>
        <div class="pao-triad">
          <div class="pao-node person">
            <span class="node-label">PERSON</span>
            <span class="node-val">{{ pao.person || '—' }}</span>
          </div>
          <div class="pao-divider">➔</div>
          <div class="pao-node action">
            <span class="node-label">ACTION</span>
            <span class="node-val">{{ pao.action || '—' }}</span>
          </div>
          <div class="pao-divider">➔</div>
          <div class="pao-node object">
            <span class="node-label">OBJECT</span>
            <span class="node-val">{{ pao.object || '—' }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .pao-overlay-bar {
      background: rgba(19, 25, 36, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-accent);
      border-radius: var(--radius-lg);
      padding: 14px 24px;
      box-shadow: 0 8px 30px rgba(0, 240, 255, 0.15);
      animation: fadeIn 0.2s ease-out;
      max-width: 800px;
      margin: 0 auto;
    }

    .pao-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 6px;

      .pao-tag {
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 0.75rem;
        color: var(--accent-cyan);
        letter-spacing: 0.1em;
      }

      .pao-note {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-style: italic;
      }
    }

    .pao-triad {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .pao-node {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.02);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      border-left: 3px solid transparent;

      .node-label {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        margin-bottom: 2px;
      }

      .node-val {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &.person {
        border-left-color: var(--accent-cyan);
        .node-label { color: var(--accent-cyan); }
      }

      &.action {
        border-left-color: var(--accent-amber);
        .node-label { color: var(--accent-amber); }
      }

      &.object {
        border-left-color: var(--accent-purple);
        .node-label { color: var(--accent-purple); }
      }
    }

    .pao-divider {
      color: var(--text-muted);
      font-size: 0.85rem;
      opacity: 0.5;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class PaoHintBarComponent {
  @Input() pao: PaoEntry | null = null;
}
