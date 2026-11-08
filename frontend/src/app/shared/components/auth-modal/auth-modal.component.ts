import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="tab-switcher">
            <button
              class="tab-btn"
              [class.active]="tab() === 'login'"
              (click)="tab.set('login')"
            >
              {{ 'auth.signIn' | t }}
            </button>
            <button
              class="tab-btn"
              [class.active]="tab() === 'register'"
              (click)="tab.set('register')"
            >
              {{ 'auth.createAccount' | t }}
            </button>
          </div>
          <button class="close-btn" [attr.aria-label]="'common.close' | t" (click)="close.emit()">✕</button>
        </div>

        <!-- Form Body -->
        <div class="modal-body">
          @if (tab() === 'register') {
            <p class="modal-hint">{{ 'auth.registerHint' | t }}</p>
          }

          @if (errorMessage()) {
            <div class="error-banner">
              {{ errorMessage() }}
            </div>
          }

          @if (tab() === 'register') {
            <div class="form-group">
              <label>{{ 'auth.username' | t }}</label>
              <input
                type="text"
                [(ngModel)]="username"
                [placeholder]="'auth.usernamePlaceholder' | t"
                autocomplete="username"
                autocapitalize="none"
                spellcheck="false"
                class="form-control"
              />
            </div>
          }

          <div class="form-group">
            <label>{{ (tab() === 'login' ? 'auth.emailOrUsername' : 'auth.email') | t }}</label>
            <input
              type="text"
              [(ngModel)]="identifier"
              placeholder="you@example.com"
              [attr.autocomplete]="tab() === 'login' ? 'username' : 'email'"
              [attr.inputmode]="tab() === 'login' ? 'text' : 'email'"
              autocapitalize="none"
              spellcheck="false"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>{{ 'auth.password' | t }}</label>
            <input
              type="password"
              [(ngModel)]="password"
              [placeholder]="'auth.passwordPlaceholder' | t"
              [attr.autocomplete]="tab() === 'login' ? 'current-password' : 'new-password'"
              class="form-control"
            />
          </div>

          <button
            class="btn-primary full-width"
            [disabled]="isLoading()"
            (click)="submit()"
          >
            @if (isLoading()) {
              <span>{{ 'auth.wait' | t }}</span>
            } @else {
              <span>{{ (tab() === 'login' ? 'auth.signIn' : 'auth.createAccount') | t }}</span>
            }
          </button>
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

    .tab-switcher {
      display: flex;
      gap: 4px;
      background: var(--surface-2);
      padding: 4px;
      border-radius: var(--radius-md);
      flex: 1;
    }

    .tab-btn {
      flex: 1;
      padding: 8px 12px;
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

    .modal-hint {
      color: var(--text-2);
      font-size: 0.95rem;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-top: 6px;
    }

    .error-banner {
      background: var(--danger-soft);
      color: var(--danger);
      padding: 10px 12px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 14px;
    }

    @media (max-width: 600px) {
      .modal-card {
        padding: 18px;
      }
    }
  `],
})
export class AuthModalComponent {
  private readonly authService = inject(AuthService);
  private readonly i18n = inject(I18nService);

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

  // Server messages are English-only, so map the status code to a translated message.
  private errorText(err: { status?: number }): string {
    switch (err.status) {
      case 400: return this.i18n.t('auth.errorInput');
      case 401: return this.i18n.t('auth.errorInvalid');
      case 409: return this.i18n.t('auth.errorTaken');
      case 429: return this.i18n.t('auth.errorTooMany');
      default: return this.i18n.t('auth.errorGeneric');
    }
  }

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
          this.errorMessage.set(this.errorText(err));
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
          this.errorMessage.set(this.errorText(err));
        },
      });
    }
  }
}
