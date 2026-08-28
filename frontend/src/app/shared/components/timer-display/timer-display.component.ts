import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer-container" [class.running]="isRunning">
      <div class="timer-pulse-dot"></div>
      <div class="timer-values">
        <span class="timer-main">{{ formattedTime().main }}</span>
        <span class="timer-ms">.{{ formattedTime().ms }}</span>
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
      gap: 12px;
      background: rgba(19, 25, 36, 0.9);
      border: 1px solid var(--border-subtle);
      padding: 8px 20px;
      border-radius: var(--radius-full);
      font-family: var(--font-mono);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all var(--transition-fast);

      &.running {
        border-color: var(--accent-cyan);
        box-shadow: 0 0 20px var(--accent-cyan-glow);

        .timer-pulse-dot {
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
          animation: timerPulse 1s infinite alternate;
        }

        .timer-main {
          color: #ffffff;
        }
      }
    }

    .timer-pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--text-muted);
    }

    .timer-values {
      display: flex;
      align-items: baseline;
    }

    .timer-main {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text-primary);
    }

    .timer-ms {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-cyan);
      min-width: 28px;
    }

    .timer-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-left: 1px solid var(--border-subtle);
      padding-left: 10px;
      font-family: var(--font-sans);
    }

    @keyframes timerPulse {
      0% { opacity: 0.4; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1.2); }
    }
  `],
})
export class TimerDisplayComponent {
  @Input() milliseconds = 0;
  @Input() isRunning = false;
  @Input() label = 'TIME';

  formattedTime = computed(() => {
    const ms = this.milliseconds;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      ms: centiseconds.toString().padStart(2, '0'),
    };
  });
}
