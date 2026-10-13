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
        <a routerLink="/" class="brand">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-name">Mnemonic Trainer</span>
        </a>

        <nav class="nav-links" aria-label="Main">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Home</a>
          <a routerLink="/numbers" routerLinkActive="active" class="nav-link">Numbers</a>
          <a routerLink="/cards" routerLinkActive="active" class="nav-link">Cards</a>
          <a routerLink="/words" routerLinkActive="active" class="nav-link">Words</a>
          <a routerLink="/pao" routerLinkActive="active" class="nav-link">PAO list</a>
          <a routerLink="/stats" routerLinkActive="active" class="nav-link">Progress</a>
        </nav>

        <div class="user-area">
          @if (authService.isAuthenticated()) {
            @if (authService.isGuest()) {
              <span class="user-name">{{ authService.currentUser()?.username }}</span>
              <button class="btn-primary btn-sm" (click)="openAuthModal('register')">Save progress</button>
              <button class="btn-secondary btn-sm" (click)="openAuthModal('login')">Sign in</button>
            } @else {
              <span class="avatar" aria-hidden="true">
                {{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}
              </span>
              <span class="user-name">{{ authService.currentUser()?.username }}</span>
              <button class="btn-secondary btn-sm" (click)="authService.logout()">Sign out</button>
            }
          } @else {
            <button class="btn-primary btn-sm" (click)="openAuthModal('login')">Sign in</button>
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
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text);
    }

    .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--accent);
      color: var(--on-accent);
      display: grid;
      place-items: center;
      font-weight: 700;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.05rem;
    }

    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
      overflow-x: auto;
    }

    .nav-link {
      padding: 8px 12px;
      border-radius: var(--radius-md);
      color: var(--text-2);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      white-space: nowrap;
      transition: background-color var(--transition-fast), color var(--transition-fast);

      &:hover {
        background: var(--surface-2);
        color: var(--text);
      }

      &.active {
        background: var(--accent-soft);
        color: var(--accent-ink);
      }
    }

    .user-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-name {
      color: var(--text-2);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-full);
      background: var(--accent-soft);
      color: var(--accent-ink);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 0.85rem;
    }

    @media (max-width: 860px) {
      .header-container {
        gap: 12px;
        padding: 10px 16px;
      }

      .nav-links {
        order: 3;
        flex-basis: 100%;
      }

      .user-area {
        margin-left: auto;
      }

      .user-name {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .brand-name {
        display: none;
      }
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
