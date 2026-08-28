import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="tab-switcher">
            <button
              class="tab-btn"
              [class.active]="tab() === 'login'"
              (click)="tab.set('login')"
            >
              Sign In
            </button>
            <button
              class="tab-btn"
              [class.active]="tab() === 'register'"
              (click)="tab.set('register')"
            >
              Create Account
            </button>
          </div>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <!-- Form Body -->
        <div class="modal-body">
          @if (errorMessage()) {
            <div class="error-banner">
              {{ errorMessage() }}
            </div>
          }

          @if (tab() === 'register') {
            <div class="form-group">
              <label>Athlete Username</label>
              <input
                type="text"
                [(ngModel)]="username"
                placeholder="e.g. MemoryChampion"
                class="form-control"
              />
            </div>
          }

          <div class="form-group">
            <label>{{ tab() === 'login' ? 'Email or Username' : 'Email Address' }}</label>
            <input
              type="text"
              [(ngModel)]="identifier"
              placeholder="athlete@example.com"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              placeholder="••••••••"
              class="form-control"
            />
          </div>

          <button
            class="btn-primary full-width"
            [disabled]="isLoading()"
            (click)="submit()"
          >
            @if (isLoading()) {
              <span>Authenticating...</span>
            } @else {
              <span>{{ tab() === 'login' ? 'Sign In to Profile' : 'Save & Register Account' }}</span>
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal-card {
      width: 100%;
      max-width: 440px;
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

      .tab-switcher {
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
        font-size: 0.85rem;
        font-weight: 700;
        padding: 6px 16px;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--transition-fast);

        &.active {
          background: var(--accent-cyan);
          color: #040914;
        }
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px;

        &:hover { color: var(--text-primary); }
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 18px;

      label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-secondary);
      }

      .form-control {
        background: var(--bg-base);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 12px 16px;
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 0.95rem;
        transition: all var(--transition-fast);

        &:focus {
          outline: none;
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan-glow);
        }
      }
    }

    .full-width {
      width: 100%;
      margin-top: 8px;
    }

    .error-banner {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: var(--accent-rose);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    @keyframes modalSlide {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class AuthModalComponent {
  private readonly authService = inject(AuthService);

  @Input() set initialTab(t: 'login' | 'register') {
    this.tab.set(t);
  }
  @Output() close = new EventEmitter<void>();

  readonly tab = signal<'login' | 'register'>('login');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  username = '';
  identifier = '';
  password = '';

  submit() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    if (this.tab() === 'register') {
      this.authService.register(this.username, this.identifier, this.password).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Registration failed');
        },
      });
    } else {
      this.authService.login(this.identifier, this.password).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid credentials');
        },
      });
    }
  }
}
