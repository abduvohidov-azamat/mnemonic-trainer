import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { ApiService } from '../../core/services/api.service';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

type Discipline = 'numbers' | 'cards' | 'words';

interface ProgressPoint {
  date: string;
  accuracy: number;
  speedDpm: number | null;
  score: number;
}

const SPEED_UNITS: Record<Discipline, string> = {
  numbers: 'digits / min',
  cards: 'cards / min',
  words: 'words / min',
};

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-page">
      <div class="stats-header">
        <h1 class="page-title">Your progress</h1>
        <p class="page-subtitle">How your accuracy and speed change over time, plus your best results in each mode.</p>
      </div>

      <div class="progress-card panel">
        <div class="progress-head">
          <h2 class="section-title">Progress over time</h2>
          <div class="progress-tabs" role="tablist">
            @for (tab of disciplineTabs; track tab.id) {
              <button
                class="progress-tab"
                role="tab"
                [class.active]="progressDiscipline() === tab.id"
                [attr.aria-selected]="progressDiscipline() === tab.id"
                (click)="selectProgressDiscipline(tab.id)"
              >
                {{ tab.label }}
              </button>
            }
          </div>
        </div>

        <div class="charts-grid" [class.is-empty]="!hasProgress()">
          <figure class="chart-box">
            <figcaption class="chart-title">Accuracy <span class="chart-unit">%</span></figcaption>
            <div class="chart-canvas-wrap">
              <canvas #accuracyCanvas aria-label="Accuracy per session" role="img"></canvas>
            </div>
          </figure>
          <figure class="chart-box">
            <figcaption class="chart-title">Speed <span class="chart-unit">{{ speedUnit() }}</span></figcaption>
            <div class="chart-canvas-wrap">
              <canvas #speedCanvas aria-label="Speed per session" role="img"></canvas>
            </div>
          </figure>
          @if (!hasProgress()) {
            <div class="charts-empty">No sessions in this mode yet. Finish a drill to see your progress here.</div>
          }
        </div>
      </div>

      <div class="disciplines-stats-grid">
        @for (tab of disciplineTabs; track tab.id) {
          <div class="discipline-stat-box panel">
            <h3 class="box-title">{{ tab.label }}</h3>
            <dl class="box-stats">
              <div class="row"><dt>Sessions</dt><dd>{{ stats()?.[tab.id]?.sessions || 0 }}</dd></div>
              <div class="row"><dt>Best score</dt><dd>{{ stats()?.[tab.id]?.bestScore || 0 }}</dd></div>
              <div class="row"><dt>Best speed</dt><dd>{{ stats()?.[tab.id]?.bestDpm || 0 }} {{ unitFor(tab.id) }}</dd></div>
              <div class="row"><dt>Average accuracy</dt><dd>{{ stats()?.[tab.id]?.avgAccuracy || 0 }}%</dd></div>
            </dl>
          </div>
        }
      </div>

      <div class="history-table-card panel">
        <h2 class="section-title">Recent sessions</h2>
        <div class="table-responsive">
          <table class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th class="num">Accuracy</th>
                <th class="num">Score</th>
                <th class="num">Time</th>
                <th class="num">Speed</th>
              </tr>
            </thead>
            <tbody>
              @for (session of history(); track session.id) {
                <tr>
                  <td class="text-muted">{{ session.createdAt | date:'MMM d, HH:mm' }}</td>
                  <td>{{ disciplineLabel(session.discipline) }}</td>
                  <td class="num font-mono" [class.text-success]="session.accuracy >= 90" [class.text-danger]="session.accuracy < 60">
                    {{ session.accuracy }}%
                  </td>
                  <td class="num font-mono">{{ session.score }}</td>
                  <td class="num font-mono">{{ (session.durationMs / 1000).toFixed(1) }}s</td>
                  <td class="num font-mono">{{ session.speedDpm }}/min</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-state">No sessions yet. Start a drill from the home page.</td>
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
      padding: 32px 24px 48px;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;

      @media (max-width: 600px) {
        padding: 20px 16px 40px;
      }
    }

    .section-title {
      font-size: 1.15rem;
    }

    .progress-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .progress-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .progress-tabs {
      display: flex;
      gap: 4px;
      background: var(--surface-2);
      padding: 4px;
      border-radius: var(--radius-md);
    }

    .progress-tab {
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-2);
      font-weight: 600;
      font-size: 0.9rem;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;

      &.active {
        background: var(--surface);
        border-color: var(--border);
        color: var(--text);
        box-shadow: var(--shadow-sm);
      }
    }

    .charts-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;

      &.is-empty .chart-box {
        opacity: 0.35;
      }
    }

    .chart-box {
      margin: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 14px;
      min-width: 0;
    }

    .chart-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 10px;

      .chart-unit {
        color: var(--text-3);
        font-weight: 400;
        margin-left: 4px;
      }
    }

    .chart-canvas-wrap {
      position: relative;
      height: 220px;
    }

    .charts-empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--text-2);
      font-weight: 600;
    }

    .disciplines-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
    }

    .discipline-stat-box {
      padding: 18px 20px;

      .box-title {
        font-size: 1.05rem;
        margin-bottom: 10px;
      }

      .box-stats {
        display: flex;
        flex-direction: column;

        .row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 7px 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.95rem;

          &:last-child {
            border-bottom: none;
          }

          dt {
            color: var(--text-2);
          }

          dd {
            font-weight: 600;
            font-variant-numeric: tabular-nums;
          }
        }
      }
    }

    .history-table-card {
      padding: 20px;

      .section-title {
        margin-bottom: 12px;
      }
    }

    .table-responsive {
      overflow-x: auto;
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;

      th {
        text-align: left;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-3);
        padding: 8px 12px;
        border-bottom: 1px solid var(--border);
        white-space: nowrap;
      }

      td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--border);
        white-space: nowrap;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      tbody tr:hover td {
        background: var(--surface-2);
      }

      .num {
        text-align: right;
      }

      .empty-state {
        text-align: center;
        color: var(--text-2);
        padding: 28px 12px;
        white-space: normal;
      }
    }
  `],
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);

  @ViewChild('accuracyCanvas') accuracyCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('speedCanvas') speedCanvas?: ElementRef<HTMLCanvasElement>;

  readonly stats = signal<any>(null);
  readonly history = signal<any[]>([]);
  readonly progressDiscipline = signal<Discipline>('numbers');

  readonly disciplineTabs: { id: Discipline; label: string }[] = [
    { id: 'numbers', label: 'Numbers' },
    { id: 'cards', label: 'Cards' },
    { id: 'words', label: 'Words' },
  ];

  private accuracyChart?: Chart;
  private speedChart?: Chart;

  ngOnInit() {
    this.api.get<any>('sessions/stats').subscribe({
      next: (res) => {
        this.stats.set(res);
        this.renderCharts();
      },
      error: (err) => console.warn('Failed to load stats', err),
    });

    this.api.get<any[]>('sessions/history?limit=30').subscribe({
      next: (res) => this.history.set(res || []),
      error: (err) => console.warn('Failed to load history', err),
    });
  }

  ngOnDestroy() {
    this.accuracyChart?.destroy();
    this.speedChart?.destroy();
  }

  selectProgressDiscipline(discipline: Discipline) {
    this.progressDiscipline.set(discipline);
    this.renderCharts();
  }

  speedUnit(): string {
    return SPEED_UNITS[this.progressDiscipline()];
  }

  unitFor(discipline: Discipline): string {
    return SPEED_UNITS[discipline];
  }

  disciplineLabel(discipline: string): string {
    return this.disciplineTabs.find((tab) => tab.id === discipline)?.label ?? discipline;
  }

  hasProgress(): boolean {
    return this.progressPoints().length > 0;
  }

  private progressPoints(): ProgressPoint[] {
    return this.stats()?.[this.progressDiscipline()]?.progress ?? [];
  }

  private renderCharts() {
    if (!this.accuracyCanvas || !this.speedCanvas) return;

    const points = this.progressPoints();
    const labels = points.map((_, i) => `#${i + 1}`);
    const dates = points.map((p) =>
      new Date(p.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
    );
    const css = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;

    this.accuracyChart?.destroy();
    this.speedChart?.destroy();

    this.accuracyChart = this.buildLineChart(this.accuracyCanvas.nativeElement, {
      labels,
      dates,
      values: points.map((p) => p.accuracy),
      color: token('--chart-1', '#2f5bd3'),
      range: { min: 0, max: 100 },
      format: (v) => `${v}%`,
      token,
    });
    this.speedChart = this.buildLineChart(this.speedCanvas.nativeElement, {
      labels,
      dates,
      values: points.map((p) => p.speedDpm ?? 0),
      color: token('--chart-2', '#b45309'),
      range: { min: 0 },
      format: (v) => `${v} ${this.speedUnit()}`,
      token,
    });
  }

  private buildLineChart(
    canvas: HTMLCanvasElement,
    opts: {
      labels: string[];
      dates: string[];
      values: number[];
      color: string;
      range: { min: number; max?: number };
      format: (value: number) => string;
      token: (name: string, fallback: string) => string;
    },
  ): Chart {
    const muted = opts.token('--text-3', '#6b7480');
    const surface = opts.token('--surface', '#ffffff');
    const grid = opts.token('--chart-grid', '#e5e8ed');
    const axis = opts.token('--border-strong', '#c3c9d2');
    const tickFont = { family: 'Source Sans 3', size: 12 };

    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: opts.labels,
        datasets: [
          {
            data: opts.values,
            borderColor: opts.color,
            backgroundColor: opts.color,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBorderColor: surface,
            pointBorderWidth: 2,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: (items) => `Session ${items[0].label} · ${opts.dates[items[0].dataIndex]}`,
              label: (item) => opts.format(item.parsed.y ?? 0),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: axis },
            ticks: { color: muted, maxTicksLimit: 8, font: tickFont },
          },
          y: {
            ...opts.range,
            grid: { color: grid },
            border: { display: false },
            ticks: { color: muted, maxTicksLimit: 5, font: tickFont },
          },
        },
      },
    });
  }
}
