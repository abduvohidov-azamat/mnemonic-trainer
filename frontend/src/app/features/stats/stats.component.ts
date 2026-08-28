import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-page">
      <!-- Header -->
      <div class="stats-header glass-panel">
        <div>
          <div class="badge badge-cyan">TELEMETRY & ANALYTICS</div>
          <h1 class="title">Athlete Performance History</h1>
          <p class="subtitle">Detailed breakdown of speed progression, error rates, and personal championship benchmarks.</p>
        </div>
      </div>

      <!-- Top Summary Metrics -->
      <div class="metrics-row">
        <div class="metric-card glass-panel">
          <span class="metric-label">TOTAL SESSIONS</span>
          <span class="metric-val font-mono text-cyan">{{ stats()?.totalSessions || 0 }}</span>
          <span class="metric-sub">Completed drills</span>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-label">NUMBERS SPEED</span>
          <span class="metric-val font-mono text-amber">{{ stats()?.numbers?.bestDpm || 0 }}</span>
          <span class="metric-sub">Peak Digits / Min (DPM)</span>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-label">NUMBERS ACCURACY</span>
          <span class="metric-val font-mono text-emerald">{{ stats()?.numbers?.avgAccuracy || 0 }}%</span>
          <span class="metric-sub">Average accuracy</span>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-label">CARDS ACCURACY</span>
          <span class="metric-val font-mono text-cyan">{{ stats()?.cards?.avgAccuracy || 0 }}%</span>
          <span class="metric-sub">Average accuracy</span>
        </div>
      </div>

      <!-- Discipline Cards Comparison -->
      <div class="disciplines-stats-grid">
        <!-- Numbers Stat Box -->
        <div class="discipline-stat-box glass-panel">
          <div class="box-head">
            <span class="box-icon">🔢</span>
            <h3>Speed Numbers</h3>
          </div>
          <div class="box-stats">
            <div class="row"><span>Total Runs:</span><strong>{{ stats()?.numbers?.sessions || 0 }}</strong></div>
            <div class="row"><span>Best Score:</span><strong class="text-emerald">{{ stats()?.numbers?.bestScore || 0 }} pts</strong></div>
            <div class="row"><span>Best Speed:</span><strong class="text-amber">{{ stats()?.numbers?.bestDpm || 0 }} DPM</strong></div>
            <div class="row"><span>Avg Accuracy:</span><strong>{{ stats()?.numbers?.avgAccuracy || 0 }}%</strong></div>
          </div>
        </div>

        <!-- Cards Stat Box -->
        <div class="discipline-stat-box glass-panel">
          <div class="box-head">
            <span class="box-icon">🃏</span>
            <h3>Speed Cards</h3>
          </div>
          <div class="box-stats">
            <div class="row"><span>Total Runs:</span><strong>{{ stats()?.cards?.sessions || 0 }}</strong></div>
            <div class="row"><span>Best Score:</span><strong class="text-emerald">{{ stats()?.cards?.bestScore || 0 }} pts</strong></div>
            <div class="row"><span>Best Speed:</span><strong class="text-amber">{{ stats()?.cards?.bestDpm || 0 }} CPM</strong></div>
            <div class="row"><span>Avg Accuracy:</span><strong>{{ stats()?.cards?.avgAccuracy || 0 }}%</strong></div>
          </div>
        </div>

        <!-- Words Stat Box -->
        <div class="discipline-stat-box glass-panel">
          <div class="box-head">
            <span class="box-icon">📖</span>
            <h3>Random Words</h3>
          </div>
          <div class="box-stats">
            <div class="row"><span>Total Runs:</span><strong>{{ stats()?.words?.sessions || 0 }}</strong></div>
            <div class="row"><span>Best Score:</span><strong class="text-emerald">{{ stats()?.words?.bestScore || 0 }} pts</strong></div>
            <div class="row"><span>Best Speed:</span><strong class="text-amber">{{ stats()?.words?.bestDpm || 0 }} WPM</strong></div>
            <div class="row"><span>Avg Accuracy:</span><strong>{{ stats()?.words?.avgAccuracy || 0 }}%</strong></div>
          </div>
        </div>
      </div>

      <!-- Recent Sessions Log Table -->
      <div class="history-table-card glass-panel">
        <h3 class="table-title">Recent Training Logs</h3>
        <div class="table-responsive">
          <table class="history-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Discipline</th>
                <th>Accuracy</th>
                <th>Score</th>
                <th>Duration</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              @for (session of history(); track session.id) {
                <tr>
                  <td class="font-mono text-muted">{{ session.createdAt | date:'MMM d, HH:mm' }}</td>
                  <td>
                    <span class="disc-pill" [class]="session.discipline">
                      {{ session.discipline | uppercase }}
                    </span>
                  </td>
                  <td class="font-mono" [class.text-emerald]="session.accuracy >= 90" [class.text-rose]="session.accuracy < 60">
                    {{ session.accuracy }}%
                  </td>
                  <td class="font-mono font-bold">{{ session.score }}</td>
                  <td class="font-mono">{{ (session.durationMs / 1000).toFixed(1) }}s</td>
                  <td class="font-mono text-amber">{{ session.speedDpm }} /min</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-state">No training sessions recorded yet. Start a drill!</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
      min-height: calc(100vh - 80px);
    }

    .stats-header {
      padding: 28px;
      .title { font-size: 1.8rem; font-weight: 900; margin: 6px 0; }
      .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .metric-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .metric-label {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
      }

      .metric-val {
        font-size: 2.2rem;
        font-weight: 900;
      }

      .metric-sub {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }
    }

    .disciplines-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .discipline-stat-box {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .box-head {
        display: flex;
        align-items: center;
        gap: 12px;
        .box-icon { font-size: 1.6rem; }
        h3 { font-size: 1.2rem; font-weight: 800; }
      }

      .box-stats {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
          strong { color: var(--text-primary); }
        }
      }
    }

    .history-table-card {
      padding: 28px;

      .table-title {
        font-size: 1.2rem;
        font-weight: 800;
        margin-bottom: 20px;
      }
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;

      th {
        text-align: left;
        padding: 12px 16px;
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--text-muted);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        border-bottom: 1px solid var(--border-subtle);
      }

      td {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        font-size: 0.9rem;
      }

      .disc-pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: var(--radius-full);
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 800;

        &.numbers { background: rgba(0, 240, 255, 0.15); color: var(--accent-cyan); }
        &.cards { background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); }
        &.words { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); }
      }

      .empty-state {
        text-align: center;
        padding: 40px;
        color: var(--text-muted);
        font-style: italic;
      }
    }
  `],
})
export class StatsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly stats = signal<any>(null);
  readonly history = signal<any[]>([]);

  ngOnInit() {
    this.api.get<any>('sessions/stats').subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => console.warn('Failed to load stats', err),
    });

    this.api.get<any[]>('sessions/history?limit=30').subscribe({
      next: (res) => this.history.set(res || []),
      error: (err) => console.warn('Failed to load history', err),
    });
  }
}
