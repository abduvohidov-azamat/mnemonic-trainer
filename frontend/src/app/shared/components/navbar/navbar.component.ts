import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalComponent],
  template: `
    <header class="app-header">
      <div class="header-container">
        <!-- Logo & Brand -->
        <a routerLink="/" class="brand-logo">
          <div class="logo-icon">
            <span class="brain-glow">🧠</span>
          </div>
          <div class="brand-text">
            <span class="brand-title">MNEMONIC<span class="text-cyan">.PRO</span></span>
            <span class="brand-subtitle">ATHLETE ENGINE</span>
          </div>
        </a>

        <!-- Main Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <span class="icon">⚡</span> Dashboard
          </a>
          <a routerLink="/numbers" routerLinkActive="active" class="nav-link">
            <span class="icon">🔢</span> Numbers
          </a>
          <a routerLink="/cards" routerLinkActive="active" class="nav-link">
            <span class="icon">🃏</span> Cards
          </a>
          <a routerLink="/words" routerLinkActive="active" class="nav-link">
            <span class="icon">📖</span> Words
          </a>
          <a routerLink="/pao" routerLinkActive="active" class="nav-link pao-link">
            <span class="icon">🧩</span> PAO Matrix
          </a>
          <a routerLink="/stats" routerLinkActive="active" class="nav-link">
            <span class="icon">📊</span> Stats
          </a>
        </nav>

        <!-- Athlete Profile / Guest Status -->
        <div class="user-action-group">
          @if (authService.isAuthenticated()) {
            @if (authService.isGuest()) {
              <button class="guest-pill" (click)="openAuthModal('register')">
                <span class="guest-dot"></span>
                <span class="username">{{ authService.currentUser()?.username }} (Guest)</span>
                <span class="save-badge">Save Profile</span>
              </button>
            } @else {
              <div class="user-pill">
                <div class="avatar-circle">
                  {{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="username">{{ authService.currentUser()?.username }}</span>
                <button class="logout-btn" (click)="authService.logout()" title="Logout">✕</button>
              </div>
            }
          } @else {
            <button class="btn-primary btn-sm" (click)="openAuthModal('login')">
              Sign In
            </button>
          }
        </div>
      </div>
    </header>

    @if (showAuthModal()) {
      <app-auth-modal
        [initialTab]="authModalTab()"
        (close)="showAuthModal.set(false)"
      ></app-auth-modal>
    }
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 23, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.25));
      border: 1px solid var(--border-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.15rem;
      font-weight: 900;
      letter-spacing: 0.08em;
    }

    .brand-subtitle {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--text-muted);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.03);
      padding: 6px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all var(--transition-fast);

      .icon {
        font-size: 0.95rem;
      }

      &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        color: #040914;
        background: var(--accent-cyan);
        font-weight: 700;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
      }
    }

    .guest-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      color: var(--text-primary);
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--accent-amber);
        box-shadow: 0 0 15px var(--accent-amber-glow);
      }

      .guest-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-amber);
        box-shadow: 0 0 8px var(--accent-amber);
      }

      .save-badge {
        background: rgba(255, 183, 3, 0.15);
        color: var(--accent-amber);
        padding: 2px 8px;
        border-radius: var(--radius-full);
        font-size: 0.72rem;
        font-weight: 700;
      }
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      padding: 4px 12px;
      border-radius: var(--radius-full);

      .avatar-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--accent-cyan);
        color: #040914;
        font-weight: 800;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logout-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 2px 6px;
        border-radius: 4px;

        &:hover {
          color: var(--accent-rose);
          background: rgba(244, 63, 94, 0.1);
        }
      }
    }

    .btn-sm {
      padding: 8px 18px;
      font-size: 0.85rem;
    }
  `],
})
export class NavbarComponent {
  readonly authService = inject(AuthService);

  readonly showAuthModal = signal<boolean>(false);
  readonly authModalTab = signal<'login' | 'register'>('login');

  openAuthModal(tab: 'login' | 'register') {
    this.authModalTab.set(tab);
    this.showAuthModal.set(true);
  }
}
