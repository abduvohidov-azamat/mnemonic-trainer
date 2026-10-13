import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer-container" [class.running]="isRunning">
      <div class="timer-pulse-dot"></div>
      <div class="timer-values">
        <span class="timer-main">{{ formattedTime.main }}</span>
        <span class="timer-ms">.{{ formattedTime.ms }}</span>
      </div>
      @if (label) {
        <span class="timer-label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    .timer-container {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--surface-2);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-family: var(--font-mono);

      &.running .timer-pulse-dot {
        background: var(--success);
      }
    }

    .timer-pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-3);
    }

    .timer-values {
      display: flex;
      align-items: baseline;
    }

    .timer-main {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text);
    }

    .timer-ms {
      font-size: 0.95rem;
      color: var(--text-3);
      min-width: 28px;
    }

    .timer-label {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-2);
    }
  `],
})
export class TimerDisplayComponent {
  @Input() milliseconds = 0;
  @Input() isRunning = false;
  @Input() label = 'TIME';

  get formattedTime() {
    const ms = this.milliseconds;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      ms: centiseconds.toString().padStart(2, '0'),
    };
  }
}
