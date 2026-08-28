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
      <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="key-badge font-mono">{{ entry.key }}</span>
            <div class="title-wrap">
              <h3 class="modal-title">Edit PAO Definition</h3>
              <span class="modal-sub">{{ entry.type === 'card' ? 'Playing Card' : 'Major System Number' }}</span>
            </div>
          </div>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <!-- Edit Form -->
        <div class="modal-form">
          <div class="form-group person-group">
            <label>PERSON (WHO)</label>
            <input
              type="text"
              [(ngModel)]="person"
              placeholder="e.g. Albert Einstein"
              class="form-control"
            />
          </div>

          <div class="form-group action-group">
            <label>ACTION (DOING WHAT)</label>
            <input
              type="text"
              [(ngModel)]="action"
              placeholder="e.g. splitting with laser"
              class="form-control"
            />
          </div>

          <div class="form-group object-group">
            <label>OBJECT (WITH WHAT)</label>
            <input
              type="text"
              [(ngModel)]="object"
              placeholder="e.g. Atom Core"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Mnemonic Notes / Phonetics</label>
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
          <button class="btn-primary" (click)="onSave()">Save Changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal-card {
      width: 100%;
      max-width: 520px;
      padding: 28px;
      background: var(--bg-surface);
      border: 1px solid var(--border-accent);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      animation: modalSlide 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 14px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .key-badge {
        font-size: 1.4rem;
        font-weight: 900;
        background: rgba(0, 240, 255, 0.15);
        color: var(--accent-cyan);
        border: 1px solid var(--accent-cyan);
        padding: 4px 12px;
        border-radius: var(--radius-sm);
        box-shadow: 0 0 15px var(--accent-cyan-glow);
      }

      .modal-title {
        font-size: 1.2rem;
        font-weight: 800;
      }

      .modal-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.2rem;
        cursor: pointer;
        &:hover { color: var(--text-primary); }
      }
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      &.person-group label { color: var(--accent-cyan); }
      &.action-group label { color: var(--accent-amber); }
      &.object-group label { color: var(--accent-purple); }

      .form-control {
        background: var(--bg-base);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 0.95rem;

        &:focus {
          outline: none;
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan-glow);
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    @keyframes modalSlide {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
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
