import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- Hero Banner -->
      <div class="hero-card glass-panel">
        <div class="hero-content">
          <div class="badge badge-cyan">HIGH PERFORMANCE COGNITION</div>
          <h1 class="hero-title">
            Mnemonic Athlete <span class="text-cyan">Training Ground</span>
          </h1>
          <p class="hero-desc">
            Train world-championship memory techniques: chunking, visual spatial
            loci, and the Person-Action-Object (PAO) Major System matrix.
          </p>
          <div class="hero-actions">
            <a routerLink="/numbers" class="btn-primary">
              <span>⚡ Start Speed Numbers</span>
            </a>
            <a routerLink="/cards" class="btn-secondary">
              <span>🃏 Train 52 Cards</span>
            </a>
            <a routerLink="/pao" class="btn-secondary">
              <span>🧩 Edit PAO Table</span>
            </a>
          </div>
        </div>

        <div class="hero-stats-panel">
          <div class="stat-box">
            <span class="stat-val font-mono text-cyan">{{
              stats()?.totalSessions || 0
            }}</span>
            <span class="stat-label">Sessions Run</span>
          </div>
          <div class="stat-box">
            <span class="stat-val font-mono text-amber">{{
              stats()?.numbers?.bestDpm || 0
            }}</span>
            <span class="stat-label">Best Numbers DPM</span>
          </div>
          <div class="stat-box">
            <span class="stat-val font-mono text-emerald">{{
              stats()?.cards?.bestScore || 0
            }}</span>
            <span class="stat-label">Top Cards Score</span>
          </div>
        </div>
      </div>

      <!-- Discipline Cards Grid -->
      <div class="disciplines-grid">
        <!-- Speed Numbers -->
        <div
          class="discipline-card glass-panel glass-panel-interactive"
          routerLink="/numbers"
        >
          <div class="card-icon-wrap numbers-gradient">
            <span>🔢</span>
          </div>
          <div class="card-body">
            <span class="discipline-tag">DISCIPLINE 01</span>
            <h3 class="card-title">Speed Numbers</h3>
            <p class="card-desc">
              Memorize sequences of 20 to 500 digits with customizable locus
              chunking (1, 2, or 3 digits) and auto-pacer.
            </p>
          </div>
          <div class="card-footer">
            <span class="action-link">Launch Training ➔</span>
          </div>
        </div>

        <!-- Speed Cards -->
        <div
          class="discipline-card glass-panel glass-panel-interactive"
          routerLink="/cards"
        >
          <div class="card-icon-wrap cards-gradient">
            <span>🃏</span>
          </div>
          <div class="card-body">
            <span class="discipline-tag">DISCIPLINE 02</span>
            <h3 class="card-title">Speed Cards</h3>
            <p class="card-desc">
              Memorize a standard 52-card shuffled deck or subsets with 3D card
              flips and 52-card matrix recall.
            </p>
          </div>
          <div class="card-footer">
            <span class="action-link">Launch Training ➔</span>
          </div>
        </div>

        <!-- Random Words -->
        <div
          class="discipline-card glass-panel glass-panel-interactive"
          routerLink="/words"
        >
          <div class="card-icon-wrap words-gradient">
            <span>📖</span>
          </div>
          <div class="card-body">
            <span class="discipline-tag">DISCIPLINE 03</span>
            <h3 class="card-title">Random Words</h3>
            <p class="card-desc">
              Link 10 to 50 randomized concrete and abstract words with smart
              Levenshtein fuzzy typo tolerance.
            </p>
          </div>
          <div class="card-footer">
            <span class="action-link">Launch Training ➔</span>
          </div>
        </div>

        <!-- PAO Matrix System -->
        <div
          class="discipline-card glass-panel glass-panel-interactive"
          routerLink="/pao"
        >
          <div class="card-icon-wrap pao-gradient">
            <span>🧩</span>
          </div>
          <div class="card-body">
            <span class="discipline-tag">CORE ENGINE</span>
            <h3 class="card-title">PAO Matrix Assistant</h3>
            <p class="card-desc">
              Browse and customize 100 Major System numbers (00-99) and all 52
              playing card associations.
            </p>
          </div>
          <div class="card-footer">
            <span class="action-link">Manage PAO ➔</span>
          </div>
        </div>
      </div>

      <!-- Quick System Guide -->
      <div class="cheatsheet-section glass-panel">
        <h3 class="section-title">Phonetic Major System Reference</h3>
        <div class="cheatsheet-grid font-mono">
          <div class="cheat-item">
            <span class="digit text-cyan">0</span><span class="sound">S, Z</span
            ><span class="ex">"Soo"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">1</span><span class="sound">T, D</span
            ><span class="ex">"Tea"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">2</span><span class="sound">N</span
            ><span class="ex">"Noah"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">3</span><span class="sound">M</span
            ><span class="ex">"May"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">4</span><span class="sound">R</span
            ><span class="ex">"Ray"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">5</span><span class="sound">L</span
            ><span class="ex">"Law"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">6</span
            ><span class="sound">CH, SH, J</span><span class="ex">"Shoe"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">7</span><span class="sound">K, G</span
            ><span class="ex">"Cow"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">8</span><span class="sound">F, V</span
            ><span class="ex">"Foe"</span>
          </div>
          <div class="cheat-item">
            <span class="digit text-cyan">9</span><span class="sound">P, B</span
            ><span class="ex">"Pie"</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 40px 24px;
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 36px;
      }

      .hero-card {
        padding: 40px;
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 32px;
        align-items: center;
        background: linear-gradient(
          135deg,
          rgba(19, 25, 36, 0.9),
          rgba(11, 15, 23, 0.95)
        );
        border: 1px solid var(--border-accent);
        box-shadow: 0 0 35px rgba(0, 240, 255, 0.08);

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
        }
      }

      .hero-content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .hero-title {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .hero-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }
      }

      .hero-stats-panel {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        background: var(--bg-base);
        padding: 20px;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-subtle);

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;

          .stat-val {
            font-size: 1.8rem;
            font-weight: 900;
          }

          .stat-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
          }
        }
      }

      .disciplines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .discipline-card {
        padding: 28px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-decoration: none;
        color: var(--text-primary);
        gap: 20px;

        .card-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .numbers-gradient {
          background: linear-gradient(
            135deg,
            rgba(0, 240, 255, 0.2),
            rgba(2, 132, 199, 0.4)
          );
          border: 1px solid var(--accent-cyan);
        }
        .cards-gradient {
          background: linear-gradient(
            135deg,
            rgba(244, 63, 94, 0.2),
            rgba(159, 18, 57, 0.4)
          );
          border: 1px solid var(--accent-rose);
        }
        .words-gradient {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.2),
            rgba(4, 120, 87, 0.4)
          );
          border: 1px solid var(--accent-emerald);
        }
        .pao-gradient {
          background: linear-gradient(
            135deg,
            rgba(255, 183, 3, 0.2),
            rgba(180, 83, 9, 0.4)
          );
          border: 1px solid var(--accent-amber);
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .discipline-tag {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: var(--text-muted);
          }

          .card-title {
            font-size: 1.4rem;
            font-weight: 800;
          }

          .card-desc {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.5;
          }
        }

        .card-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 14px;

          .action-link {
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--accent-cyan);
          }
        }
      }

      .cheatsheet-section {
        padding: 28px;

        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .cheatsheet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 12px;
        }

        .cheat-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;

          .digit {
            font-size: 1.4rem;
            font-weight: 900;
          }
          .sound {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          .ex {
            font-size: 0.7rem;
            color: var(--text-muted);
          }
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly authService = inject(AuthService);

  readonly stats = signal<any>(null);

  ngOnInit() {
    this.api.get<any>("sessions/stats").subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => console.warn("Could not fetch stats", err),
    });
  }
}
