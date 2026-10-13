import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaoService } from '../../core/services/pao.service';
import { PaoEntry } from '../../core/models/pao.models';
import { PaoEditModalComponent } from './components/pao-edit-modal/pao-edit-modal.component';

@Component({
  selector: 'app-pao-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, PaoEditModalComponent],
  template: `
    <div class="pao-page">
      <!-- Header -->
      <div class="pao-header glass-panel">
        <div class="header-main">
          <div class="badge badge-cyan">DICTIONARY ENGINE</div>
          <h1 class="title">PAO (Person-Action-Object) Matrix</h1>
          <p class="subtitle">
            Configure your standard 2-digit Major System (00-99) and 52 Playing Card mnemonic mappings.
          </p>
        </div>

        <div class="header-actions">
          <button class="btn-secondary btn-sm" (click)="resetDefaults()">
            ↺ Reset Major System Seed
          </button>
        </div>
      </div>

      <!-- Controls & Search Bar -->
      <div class="toolbar-bar glass-panel">
        <div class="tab-group">
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'numbers'"
            (click)="activeTab.set('numbers')"
          >
            🔢 Numbers (00 - 99)
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'cards'"
            (click)="activeTab.set('cards')"
          >
            🃏 Playing Cards (52)
          </button>
        </div>

        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by key, character, action, or object..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Matrix Grid -->
      <div class="matrix-grid">
        @for (item of filteredEntries(); track item.key) {
          <div
            class="pao-card glass-panel glass-panel-interactive"
            [class.custom-pao]="item.isCustom"
            (click)="openEdit(item)"
          >
            <div class="card-head">
              <span class="key-tag font-mono">{{ item.key }}</span>
              @if (item.isCustom) {
                <span class="custom-badge font-mono">CUSTOM</span>
              }
            </div>

            <div class="pao-props">
              <div class="prop-row person">
                <span class="prop-label">P</span>
                <span class="prop-text">{{ item.person || '—' }}</span>
              </div>
              <div class="prop-row action">
                <span class="prop-label">A</span>
                <span class="prop-text">{{ item.action || '—' }}</span>
              </div>
              <div class="prop-row object">
                <span class="prop-label">O</span>
                <span class="prop-text">{{ item.object || '—' }}</span>
              </div>
            </div>

            @if (item.notes) {
              <div class="pao-note-sub">{{ item.notes }}</div>
            }
          </div>
        }
      </div>

      <!-- Edit Modal -->
      @if (editingEntry()) {
        <app-pao-edit-modal
          [entry]="editingEntry()!"
          (close)="editingEntry.set(null)"
          (save)="saveEntry($event)"
        ></app-pao-edit-modal>
      }
    </div>
  `,
  styles: [`
    .pao-page {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 80px);
    }

    .pao-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      padding: 28px;
      margin-bottom: 24px;

      .title {
        font-size: 1.8rem;
        font-weight: 900;
        margin: 6px 0;
      }

      .subtitle {
        color: var(--text-secondary);
        font-size: 0.95rem;
      }
    }

    .toolbar-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px 24px;
      margin-bottom: 24px;

      .tab-group {
        display: flex;
        gap: 6px;
        background: var(--bg-base);
        padding: 4px;
        border-radius: var(--radius-full);
      }

      .tab-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-family: var(--font-sans);
        font-size: 0.9rem;
        font-weight: 700;
        padding: 8px 20px;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--transition-fast);

        &.active {
          background: var(--accent-cyan);
          color: #040914;
        }
      }

      .search-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--bg-base);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full);
        padding: 8px 16px;
        min-width: 320px;

        .search-icon { font-size: 0.9rem; opacity: 0.6; }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;

          &:focus { outline: none; }
        }
      }
    }

    .matrix-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    .pao-card {
      padding: 16px;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.custom-pao {
        border-color: rgba(255, 183, 3, 0.4);
      }

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .key-tag {
          font-size: 1.2rem;
          font-weight: 900;
          color: #ffffff;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
        }

        .custom-badge {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--accent-amber);
          background: rgba(255, 183, 3, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .pao-props {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .prop-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;

          .prop-label {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            font-weight: 800;
            width: 18px;
            height: 18px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .prop-text {
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &.person {
            .prop-label { background: rgba(0, 240, 255, 0.15); color: var(--accent-cyan); }
            .prop-text { color: var(--text-primary); }
          }

          &.action {
            .prop-label { background: rgba(255, 183, 3, 0.15); color: var(--accent-amber); }
            .prop-text { color: var(--text-secondary); }
          }

          &.object {
            .prop-label { background: rgba(139, 92, 246, 0.15); color: var(--accent-purple); }
            .prop-text { color: var(--text-secondary); }
          }
        }
      }

      .pao-note-sub {
        font-size: 0.72rem;
        color: var(--text-muted);
        font-style: italic;
        border-top: 1px solid rgba(255, 255, 255, 0.04);
        padding-top: 6px;
      }
    }
  `],
})
export class PaoManagerComponent {
  private readonly paoService = inject(PaoService);

  readonly activeTab = signal<'numbers' | 'cards'>('numbers');
  readonly searchQuery = signal<string>('');

  readonly editingEntry = signal<PaoEntry | null>(null);

  readonly filteredEntries = computed(() => {
    const tab = this.activeTab();
    const list = tab === 'numbers' ? this.paoService.numbersPao() : this.paoService.cardsPao();
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) return list;

    return list.filter((item) =>
      item.key.toLowerCase().includes(query) ||
      item.person?.toLowerCase().includes(query) ||
      item.action?.toLowerCase().includes(query) ||
      item.object?.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query),
    );
  });

  openEdit(entry: PaoEntry) {
    this.editingEntry.set(entry);
  }

  saveEntry(data: { person: string; action: string; object: string; notes?: string }) {
    const entry = this.editingEntry();
    if (!entry) return;

    this.paoService.updateEntry(entry.key, data).subscribe({
      next: () => {
        this.editingEntry.set(null);
      },
      error: (err) => {
        console.error('Failed to save PAO entry', err);
        alert(err.error?.message || 'Could not save this PAO entry. Is the backend running?');
      },
    });
  }

  resetDefaults() {
    if (confirm('Reset your entire PAO matrix back to the default Major System seed?')) {
      this.paoService.resetToDefault().subscribe();
    }
  }
}
