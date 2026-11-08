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
          @for (link of links; track link.path) {
            <a
              #navLink
              [routerLink]="link.path"
              routerLinkActive="active"
              (isActiveChange)="onLinkActive($event, navLink)"
              class="nav-link"
            >{{ link.label }}</a>
          }
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
      position: relative;
      display: flex;
      gap: 4px;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }
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
        margin: 0 -16px;
        padding: 0 16px 2px;
        scroll-padding: 0 16px;
      }

      .user-area {
        margin-left: auto;
      }

      .user-name {
        display: none;
      }
    }

    @media (max-width: 600px) {
      .header-container {
        padding: 8px 16px;
        gap: 8px 12px;
      }

      .nav-link {
        padding: 7px 10px;
        font-size: 0.9rem;
      }

      .user-area {
        gap: 6px;
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

  readonly links = [
    { path: '/dashboard', label: 'Home' },
    { path: '/numbers', label: 'Numbers' },
    { path: '/cards', label: 'Cards' },
    { path: '/words', label: 'Words' },
    { path: '/pao', label: 'PAO list' },
    { path: '/stats', label: 'Progress' },
  ];

  readonly showAuthModal = signal<boolean>(false);
  readonly authModalTab = signal<'login' | 'register'>('login');

  // On narrow screens the links scroll sideways; keep the current page's link visible.
  onLinkActive(active: boolean, link: HTMLElement) {
    const nav = link.parentElement;
    if (!active || !nav || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2 });
  }

  openAuthModal(tab: 'login' | 'register') {
    this.authModalTab.set(tab);
    this.showAuthModal.set(true);
  }
}
