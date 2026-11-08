import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { MessageKey } from '../../core/i18n/i18n.types';

interface TrainingMode {
  path: string;
  tile: string;
  title: MessageKey;
  description: MessageKey;
  action: MessageKey;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="dashboard">
      <section class="intro">
        <div class="intro-text">
          <h1 class="page-title">
            @if (authService.currentUser()?.username; as name) {
              {{ 'dashboard.welcomeName' | t: { name } }}
            } @else {
              {{ 'dashboard.welcome' | t }}
            }
          </h1>
          <p class="page-subtitle">{{ 'dashboard.intro' | t }}</p>
        </div>

        <dl class="quick-stats">
          <div class="quick-stat">
            <dt>{{ 'dashboard.sessions' | t }}</dt>
            <dd class="font-mono">{{ stats()?.totalSessions || 0 }}</dd>
          </div>
          <div class="quick-stat">
            <dt>{{ 'dashboard.bestNumbersSpeed' | t }}</dt>
            <dd class="font-mono">{{ stats()?.numbers?.bestDpm || 0 }}<small>{{ 'dashboard.perMin' | t }}</small></dd>
          </div>
          <div class="quick-stat">
            <dt>{{ 'dashboard.bestCardsScore' | t }}</dt>
            <dd class="font-mono">{{ stats()?.cards?.bestScore || 0 }}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 class="section-title">{{ 'dashboard.training' | t }}</h2>
        <div class="modes-grid">
          @for (mode of modes; track mode.path) {
            <a class="mode-card panel-interactive" [routerLink]="mode.path">
              <span class="mode-tile font-mono" aria-hidden="true">{{ mode.tile }}</span>
              <span class="mode-body">
                <span class="mode-title">{{ mode.title | t }}</span>
                <span class="mode-desc">{{ mode.description | t }}</span>
              </span>
              <span class="mode-action">{{ mode.action | t }} →</span>
            </a>
          }
        </div>
      </section>

      <section class="cheatsheet panel">
        <div class="cheatsheet-head">
          <h2 class="section-title">{{ 'dashboard.cheatTitle' | t }}</h2>
          <p class="cheatsheet-hint">{{ 'dashboard.cheatHint' | t }}</p>
          @if ('dashboard.cheatNote' | t; as note) {
            <p class="cheatsheet-hint cheatsheet-note">{{ note }}</p>
          }
        </div>
        <div class="cheatsheet-grid">
          @for (item of majorSystem; track item.digit) {
            <div class="cheat-item">
              <span class="digit font-mono">{{ item.digit }}</span>
              <span class="sound">{{ item.sound }}</span>
              <span class="example">{{ item.example }}</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .intro {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
      align-items: center;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .intro-text .page-subtitle {
      max-width: 560px;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .quick-stat {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 14px 16px;

      dt {
        font-size: 0.8rem;
        color: var(--text-3);
        font-weight: 600;
      }

      dd {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text);

        small {
          font-size: 0.8rem;
          color: var(--text-3);
          margin-left: 2px;
        }
      }
    }

    .section-title {
      font-size: 1.15rem;
      margin-bottom: 14px;
    }

    .modes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .mode-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px;
      text-decoration: none;
      color: var(--text);
    }

    .mode-tile {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--accent-soft);
      color: var(--accent-ink);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .mode-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .mode-title {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .mode-desc {
      color: var(--text-2);
      font-size: 0.95rem;
    }

    .mode-action {
      color: var(--accent-ink);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .cheatsheet {
      padding: 24px;
    }

    .cheatsheet-head {
      margin-bottom: 16px;

      .section-title {
        margin-bottom: 4px;
      }
    }

    .cheatsheet-hint {
      color: var(--text-2);
      font-size: 0.95rem;
    }

    .cheatsheet-note {
      margin-top: 4px;
      color: var(--text-3);
      font-size: 0.875rem;
    }

    .cheatsheet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }

    .cheat-item {
      background: var(--surface-2);
      border-radius: var(--radius-md);
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .digit {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--accent-ink);
      }

      .sound {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .example {
        font-size: 0.8rem;
        color: var(--text-3);
      }
    }

    @media (max-width: 600px) {
      .dashboard {
        padding: 20px 16px 40px;
        gap: 24px;
      }

      .quick-stats {
        gap: 8px;
      }

      .quick-stat {
        padding: 10px 12px;

        dt {
          font-size: 0.75rem;
          line-height: 1.3;
        }

        dd {
          font-size: 1.25rem;
        }
      }

      .modes-grid {
        gap: 10px;
      }

      .mode-card {
        flex-direction: row;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
      }

      .mode-tile {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
      }

      .mode-desc {
        font-size: 0.9rem;
      }

      .mode-action {
        display: none;
      }

      .cheatsheet {
        padding: 16px;
      }

      .cheatsheet-grid {
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: 8px;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly authService = inject(AuthService);

  readonly stats = signal<any>(null);

  readonly modes: TrainingMode[] = [
    {
      path: '/numbers',
      tile: '123',
      title: 'nav.numbers',
      description: 'dashboard.numbersDesc',
      action: 'dashboard.start',
    },
    {
      path: '/cards',
      tile: 'A♠',
      title: 'nav.cards',
      description: 'dashboard.cardsDesc',
      action: 'dashboard.start',
    },
    {
      path: '/words',
      tile: 'Abc',
      title: 'nav.words',
      description: 'dashboard.wordsDesc',
      action: 'dashboard.start',
    },
    {
      path: '/pao',
      tile: 'PAO',
      title: 'nav.pao',
      description: 'dashboard.paoDesc',
      action: 'dashboard.open',
    },
  ];

  readonly majorSystem = [
    { digit: '0', sound: 'S, Z', example: 'Sea' },
    { digit: '1', sound: 'T, D', example: 'Tea' },
    { digit: '2', sound: 'N', example: 'Noah' },
    { digit: '3', sound: 'M', example: 'May' },
    { digit: '4', sound: 'R', example: 'Ray' },
    { digit: '5', sound: 'L', example: 'Law' },
    { digit: '6', sound: 'J, SH, CH', example: 'Shoe' },
    { digit: '7', sound: 'K, G', example: 'Cow' },
    { digit: '8', sound: 'F, V', example: 'Foe' },
    { digit: '9', sound: 'P, B', example: 'Pie' },
  ];

  ngOnInit() {
    this.api.get<any>('sessions/stats').subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => console.warn('Could not fetch stats', err),
    });
  }
}
