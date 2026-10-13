import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface TrainingMode {
  path: string;
  tile: string;
  title: string;
  description: string;
  action: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <section class="intro">
        <div class="intro-text">
          <h1 class="page-title">
            Welcome{{ authService.currentUser()?.username ? ', ' + authService.currentUser()?.username : '' }}
          </h1>
          <p class="page-subtitle">
            Pick a drill below. You'll memorise a sequence, then type it back from memory and see what you got right.
          </p>
        </div>

        <dl class="quick-stats">
          <div class="quick-stat">
            <dt>Sessions</dt>
            <dd class="font-mono">{{ stats()?.totalSessions || 0 }}</dd>
          </div>
          <div class="quick-stat">
            <dt>Best numbers speed</dt>
            <dd class="font-mono">{{ stats()?.numbers?.bestDpm || 0 }}<small>/min</small></dd>
          </div>
          <div class="quick-stat">
            <dt>Best cards score</dt>
            <dd class="font-mono">{{ stats()?.cards?.bestScore || 0 }}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 class="section-title">Training</h2>
        <div class="modes-grid">
          @for (mode of modes; track mode.path) {
            <a class="mode-card panel-interactive" [routerLink]="mode.path">
              <span class="mode-tile font-mono" aria-hidden="true">{{ mode.tile }}</span>
              <span class="mode-body">
                <span class="mode-title">{{ mode.title }}</span>
                <span class="mode-desc">{{ mode.description }}</span>
              </span>
              <span class="mode-action">{{ mode.action }} →</span>
            </a>
          }
        </div>
      </section>

      <section class="cheatsheet panel">
        <div class="cheatsheet-head">
          <h2 class="section-title">Major System cheat sheet</h2>
          <p class="cheatsheet-hint">Each digit maps to a consonant sound, so number pairs become words you can picture.</p>
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
      title: 'Numbers',
      description: 'Memorise 20 to 500 random digits, shown 1, 2 or 3 at a time.',
      action: 'Start',
    },
    {
      path: '/cards',
      tile: 'A♠',
      title: 'Cards',
      description: 'Memorise the order of a shuffled deck — 10, 26 or all 52 cards.',
      action: 'Start',
    },
    {
      path: '/words',
      tile: 'Abc',
      title: 'Words',
      description: 'Memorise a list of 10 to 50 words. Small typos still earn partial credit.',
      action: 'Start',
    },
    {
      path: '/pao',
      tile: 'PAO',
      title: 'PAO list',
      description: 'Your Person-Action-Object images for 00–99 and every card. Edit them to suit you.',
      action: 'Open',
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
