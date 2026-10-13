import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaoEntry } from '../../../../core/models/pao.models';

@Component({
  selector: 'app-pao-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="key-badge font-mono">{{ entry.key }}</span>
            <div class="title-wrap">
              <h3 class="modal-title">Edit PAO entry</h3>
              <span class="modal-sub">{{ entry.type === 'card' ? 'Playing card' : 'Number' }}</span>
            </div>
          </div>
          <button class="close-btn" aria-label="Close" (click)="close.emit()">✕</button>
        </div>

        <!-- Edit Form -->
        <div class="modal-form">
          <div class="form-group person-group">
            <label>Person</label>
            <input
              type="text"
              [(ngModel)]="person"
              placeholder="e.g. Albert Einstein"
              class="form-control"
            />
          </div>

          <div class="form-group action-group">
            <label>Action</label>
            <input
              type="text"
              [(ngModel)]="action"
              placeholder="e.g. splitting"
              class="form-control"
            />
          </div>

          <div class="form-group object-group">
            <label>Object</label>
            <input
              type="text"
              [(ngModel)]="object"
              placeholder="e.g. Atom Core"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Notes <span class="optional">(optional)</span></label>
            <input
              type="text"
              [(ngModel)]="notes"
              placeholder="e.g. 5=L, 2=N (Lane)"
              class="form-control"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn-primary" (click)="onSave()">Save</button>
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
      animation: fadeIn 0.15s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 440px;
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
