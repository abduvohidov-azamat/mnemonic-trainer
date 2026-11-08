import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaoService } from '../../core/services/pao.service';
import { PaoEntry } from '../../core/models/pao.models';
import { PaoEditModalComponent } from './components/pao-edit-modal/pao-edit-modal.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-pao-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, PaoEditModalComponent, TranslatePipe],
  template: `
    <div class="pao-page">
      <!-- Header -->
      <div class="pao-header">
        <div class="header-main">
          <h1 class="page-title">{{ 'pao.title' | t }}</h1>
          <p class="subtitle">{{ 'pao.subtitle' | t }}</p>
          @if ('pao.englishNote' | t; as note) {
            <p class="subtitle subtitle-note">{{ note }}</p>
          }
        </div>

        <div class="header-actions">
          <button class="btn-secondary btn-sm" (click)="resetDefaults()">
            {{ 'pao.reset' | t }}
          </button>
        </div>
      </div>

      <!-- Controls & Search Bar -->
      <div class="toolbar-bar">
        <div class="tab-group">
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'numbers'"
            (click)="activeTab.set('numbers')"
          >
            {{ 'pao.tabNumbers' | t }}
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'cards'"
            (click)="activeTab.set('cards')"
          >
            {{ 'pao.tabCards' | t }}
          </button>
        </div>

        <div class="search-wrap">
          <input
            type="search"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            [placeholder]="'pao.searchPlaceholder' | t"
            [attr.aria-label]="'pao.searchAria' | t"
            class="search-input"
          />
        </div>
      </div>

      <!-- Matrix Grid -->
      <div class="matrix-grid">
        @for (item of filteredEntries(); track item.key) {
          <div
            class="pao-card panel panel-interactive"
            [class.custom-pao]="item.isCustom"
            (click)="openEdit(item)"
          >
            <div class="card-head">
              <span class="key-tag font-mono">{{ item.key }}</span>
              @if (item.isCustom) {
                <span class="custom-badge">{{ 'pao.edited' | t }}</span>
              }
            </div>

            <div class="pao-props">
              <div class="prop-row person">
                <span class="prop-label">{{ 'pao.person' | t }}</span>
                <span class="prop-text">{{ item.person || '—' }}</span>
              </div>
              <div class="prop-row action">
                <span class="prop-label">{{ 'pao.action' | t }}</span>
                <span class="prop-text">{{ item.action || '—' }}</span>
              </div>
              <div class="prop-row object">
                <span class="prop-label">{{ 'pao.object' | t }}</span>
                <span class="prop-text">{{ item.object || '—' }}</span>
              </div>
            </div>

            @if (item.notes) {
              <div class="pao-note-sub">{{ item.notes }}</div>
            }
          </div>
        } @empty {
          <p class="empty-search">{{ 'pao.noMatch' | t: { q: searchQuery() } }}</p>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      @media (max-width: 600px) {
        padding: 20px 16px 40px;
      }
    }

    .pao-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;

      .subtitle {
        color: var(--text-2);
        margin-top: 4px;
        max-width: 640px;
      }

      .subtitle-note {
        color: var(--text-3);
        font-size: 0.9rem;
      }
    }

    .toolbar-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tab-group {
      display: flex;
      gap: 4px;
      background: var(--surface-2);
      padding: 4px;
      border-radius: var(--radius-md);
    }

    .tab-btn {
      padding: 7px 14px;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      background: none;
      color: var(--text-2);
      font-weight: 600;
      cursor: pointer;

      &.active {
        background: var(--surface);
        border-color: var(--border);
        color: var(--text);
        box-shadow: var(--shadow-sm);
      }
    }

    .search-wrap {
      flex: 1;
      max-width: 380px;
      min-width: 220px;

      .search-input {
        width: 100%;
        padding: 9px 12px;
        background: var(--surface);
        border: 1px solid var(--border-strong);
        border-radius: var(--radius-md);
        color: var(--text);

        &::placeholder {
          color: var(--text-3);
        }

        &:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: var(--focus-ring);
        }
      }
    }

    .matrix-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 12px;
    }

    .empty-search {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--text-2);
      padding: 32px 16px;
    }

    .pao-card {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .key-tag {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text);
        }

        .custom-badge {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 1px 8px;
          border-radius: var(--radius-full);
          background: var(--accent-soft);
          color: var(--accent-ink);
        }
      }

      .pao-props {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .prop-row {
          display: flex;
          gap: 8px;
          align-items: baseline;
          font-size: 0.95rem;

          .prop-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-3);
            min-width: 48px;
          }

          .prop-text {
            color: var(--text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .pao-note-sub {
        font-size: 0.8rem;
        color: var(--text-3);
        border-top: 1px solid var(--border);
        padding-top: 8px;
      }
    }

    @media (max-width: 600px) {
      .pao-header {
        align-items: stretch;
        gap: 12px;
      }

      .tab-group {
        width: 100%;
      }

      .tab-btn {
        flex: 1;
        padding: 8px 6px;
        white-space: nowrap;
      }

      .search-wrap {
        flex-basis: 100%;
        max-width: none;
        min-width: 0;
      }

      .matrix-grid {
        gap: 8px;
      }
    }
  `],
})
export class PaoManagerComponent {
  private readonly paoService = inject(PaoService);
  private readonly i18n = inject(I18nService);

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
        alert(this.i18n.t('errors.savePao'));
      },
    });
  }

  resetDefaults() {
    if (confirm(this.i18n.t('errors.resetPaoConfirm'))) {
      this.paoService.resetToDefault().subscribe();
    }
  }
}
