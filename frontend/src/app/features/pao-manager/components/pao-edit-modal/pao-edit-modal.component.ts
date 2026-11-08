import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaoEntry } from '../../../../core/models/pao.models';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-pao-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="key-badge font-mono">{{ entry.key }}</span>
            <div class="title-wrap">
              <h3 class="modal-title">{{ 'pao.editTitle' | t }}</h3>
              <span class="modal-sub">{{ (entry.type === 'card' ? 'pao.playingCard' : 'pao.number') | t }}</span>
            </div>
          </div>
          <button class="close-btn" [attr.aria-label]="'common.close' | t" (click)="close.emit()">✕</button>
        </div>

        <!-- Edit Form -->
        <div class="modal-form">
          <div class="form-group person-group">
            <label>{{ 'pao.person' | t }}</label>
            <input
              type="text"
              [(ngModel)]="person"
              [placeholder]="'pao.personPlaceholder' | t"
              class="form-control"
            />
          </div>

          <div class="form-group action-group">
            <label>{{ 'pao.action' | t }}</label>
            <input
              type="text"
              [(ngModel)]="action"
              [placeholder]="'pao.actionPlaceholder' | t"
              class="form-control"
            />
          </div>

          <div class="form-group object-group">
            <label>{{ 'pao.object' | t }}</label>
            <input
              type="text"
              [(ngModel)]="object"
              [placeholder]="'pao.objectPlaceholder' | t"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>{{ 'pao.notes' | t }} <span class="optional">{{ 'pao.optional' | t }}</span></label>
            <input
              type="text"
              [(ngModel)]="notes"
              [placeholder]="'pao.notesPlaceholder' | t"
              class="form-control"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-secondary" (click)="close.emit()">{{ 'common.cancel' | t }}</button>
          <button class="btn-primary" (click)="onSave()">{{ 'common.save' | t }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(15, 18, 24, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
      animation: fadeIn 0.15s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 440px;
      margin: auto;
      padding: 24px;
      box-shadow: var(--shadow-md);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--radius-sm);
      background: none;
      color: var(--text-3);
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background: var(--surface-2);
        color: var(--text);
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;

      label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text);
      }

      .form-control {
        width: 100%;
        padding: 10px 12px;
        background: var(--surface);
        border: 1px solid var(--border-strong);
        border-radius: var(--radius-md);
        color: var(--text);
        font-size: 1rem;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

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

    .modal-card {
      max-width: 480px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .key-badge {
      min-width: 48px;
      height: 48px;
      padding: 0 8px;
      border-radius: var(--radius-md);
      background: var(--accent-soft);
      color: var(--accent-ink);
      display: grid;
      place-items: center;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
    }

    .modal-title {
      font-size: 1.15rem;
    }

    .modal-sub {
      font-size: 0.9rem;
      color: var(--text-3);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .optional {
      color: var(--text-3);
      font-weight: 400;
    }

    @media (max-width: 600px) {
      .modal-card {
        padding: 18px;
      }

      .modal-footer button {
        flex: 1;
      }
    }
  `],
})
export class PaoEditModalComponent {
  @Input() entry!: PaoEntry;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ person: string; action: string; object: string; notes?: string }>();

  person = '';
  action = '';
  object = '';
  notes = '';

  ngOnInit() {
    if (this.entry) {
      this.person = this.entry.person || '';
      this.action = this.entry.action || '';
      this.object = this.entry.object || '';
      this.notes = this.entry.notes || '';
    }
  }

  onSave() {
    this.save.emit({
      person: this.person,
      action: this.action,
      object: this.object,
      notes: this.notes,
    });
  }
}
