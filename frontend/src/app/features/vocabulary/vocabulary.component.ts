import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { MessageKey } from '../../core/i18n/i18n.types';
import { ENGLISH_CARDS, LEARNER_LANGS, LearnerLang, VocabCard } from './vocabulary-preview.data';
import { JAPANESE_CARDS } from './vocabulary-japanese.data';

interface Course {
  code: 'en' | 'ja';
  label: string;
  speechLang: string;
  cards: VocabCard[];
}

interface SceneSegment {
  text: string;
  kind: 'plain' | 'keyword' | 'meaning';
}

// Splits "{Kelin} uyni [tozalamoqda]." into plain, keyword and translation pieces.
function parseScene(scene: string): SceneSegment[] {
  const segments: SceneSegment[] = [];
  for (const [, keyword, meaning, plain] of scene.matchAll(/\{([^}]+)\}|\[([^\]]+)\]|([^{[]+)/g)) {
    if (keyword) segments.push({ text: keyword, kind: 'keyword' });
    else if (meaning) segments.push({ text: meaning, kind: 'meaning' });
    else segments.push({ text: plain, kind: 'plain' });
  }
  return segments;
}

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="vocab">
      <header>
        <h1 class="page-title">{{ 'vocab.title' | t }}</h1>
        <p class="page-subtitle">{{ 'vocab.subtitle' | t }}</p>
      </header>

      <ol class="steps">
        <li>
          <span class="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"/>
            </svg>
          </span>
          <span><span class="step-num font-mono">1</span>{{ 'vocab.step1' | t }}</span>
        </li>
        <li>
          <span class="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M4 9.5c2.7-2.7 5.3-2.7 8 0s5.3 2.7 8 0M4 15.5c2.7-2.7 5.3-2.7 8 0s5.3 2.7 8 0"/>
            </svg>
          </span>
          <span><span class="step-num font-mono">2</span>{{ 'vocab.step2' | t }}</span>
        </li>
        <li>
          <span class="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <circle cx="9" cy="10" r="1.6"/>
              <path d="M4 18l5-5 4 4 3-3 4 4"/>
            </svg>
          </span>
          <span><span class="step-num font-mono">3</span>{{ 'vocab.step3' | t }}</span>
        </li>
      </ol>

      <div class="toolbar">
        <div class="toolbar-group">
          <span class="toolbar-label" id="course-label">{{ 'vocab.learn' | t }}</span>
          <div class="segmented" role="group" aria-labelledby="course-label">
            @for (c of courses; track c.code) {
              <button type="button" [attr.lang]="c.code" [attr.aria-pressed]="course() === c" (click)="selectCourse(c)">{{ c.label }}</button>
            }
          </div>
        </div>
        <div class="toolbar-group">
          <span class="toolbar-label" id="learner-label">{{ 'vocab.keywordsIn' | t }}</span>
          <div class="segmented" role="group" aria-labelledby="learner-label">
            @for (l of learnerLangs; track l.code) {
              <button type="button" [attr.lang]="l.code" [attr.aria-pressed]="learner() === l.code" (click)="chosenLearner.set(l.code)">{{ l.label }}</button>
            }
          </div>
        </div>
      </div>

      <div class="cards-grid">
        @for (card of course().cards; track card.word; let i = $index) {
          @let hint = card.hints[learner()];
          <div class="vocab-card" [class.flipped]="flipped().has(i)">
            <button
              type="button"
              class="flip"
              [attr.aria-label]="(flipped().has(i) ? 'vocab.hideAnswer' : 'vocab.showAnswer') | t: { word: card.word }"
              (click)="toggle(i)"
            >
              <span class="face front" [attr.aria-hidden]="flipped().has(i)">
                <span class="badge">{{ partOfSpeechKeys[card.partOfSpeech] | t }}</span>
                <span class="word" [attr.lang]="course().code">{{ card.word }}</span>
                @if (card.kana) {
                  <span class="kana" lang="ja">{{ card.kana }}</span>
                }
                <span class="reading font-mono">{{ card.reading }}</span>
                <span class="flip-hint">{{ 'vocab.tapToFlip' | t }}</span>
              </span>

              <span class="face back" [attr.aria-hidden]="!flipped().has(i)">
                <img class="picture" [src]="hint.image" alt="" width="280" height="140" />
                <span class="translation" [attr.lang]="learner()">{{ hint.translation }}</span>
                <span class="row">
                  <span class="row-label">{{ 'vocab.soundsLike' | t }}</span>
                  <span class="keyword" [attr.lang]="learner()">{{ hint.keyword }}</span>
                </span>
                <span class="row">
                  <span class="row-label">{{ 'vocab.picture' | t }}</span>
                  <span class="scene" [attr.lang]="learner()">
                    @for (seg of scene(hint.scene); track $index) {
                      <span [class]="'seg-' + seg.kind">{{ seg.text }}</span>
                    }
                  </span>
                </span>
                <span class="row">
                  <span class="row-label">{{ 'vocab.example' | t }}</span>
                  <span class="example" [attr.lang]="course().code">{{ card.example }}</span>
                  @if (card.exampleReading) {
                    <span class="example-reading">{{ card.exampleReading }}</span>
                  }
                </span>
              </span>
            </button>

            @if (canSpeak) {
              <button
                type="button"
                class="speak"
                [attr.aria-label]="'vocab.listen' | t: { word: card.word }"
                [title]="'vocab.listen' | t: { word: card.word }"
                (click)="speak(card)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"/>
                </svg>
              </button>
            }
          </div>
        }
      </div>

      <p class="preview-note">{{ 'vocab.previewNote' | t }}</p>
    </div>
  `,
  styles: [`
    .vocab {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .steps {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        color: var(--text-2);
        font-size: 0.95rem;
      }
    }

    .step-icon {
      flex-shrink: 0;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--accent-soft);
      color: var(--accent-ink);
      display: grid;
      place-items: center;
    }

    .step-num {
      margin-right: 6px;
      font-weight: 700;
      color: var(--accent-ink);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 12px 28px;
      flex-wrap: wrap;
    }

    .toolbar-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toolbar-label {
      color: var(--text-2);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .segmented {
      display: inline-flex;
      padding: 3px;
      gap: 3px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);

      button {
        border: 0;
        background: transparent;
        padding: 6px 14px;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-2);
        cursor: pointer;

        &[aria-pressed='true'] {
          background: var(--surface);
          color: var(--text);
          box-shadow: var(--shadow-sm);
        }
      }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .vocab-card {
      position: relative;
      perspective: 1200px;
    }

    .flip {
      display: grid;
      width: 100%;
      min-height: 340px;
      padding: 0;
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.45s ease;
      border-radius: var(--radius-lg);
    }

    .flipped .flip {
      transform: rotateY(180deg);
    }

    /* Both faces share one grid cell, so the card is as tall as its taller side. */
    .face {
      grid-area: 1 / 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    .flip:hover .face {
      border-color: var(--border-strong);
      box-shadow: var(--shadow-md);
    }

    .front {
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;

      .badge {
        margin-bottom: 8px;
      }
    }

    .word {
      font-size: 2.4rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.1;
    }

    .kana {
      color: var(--text-2);
      font-size: 1.15rem;
    }

    .reading {
      color: var(--text-3);
      font-size: 1rem;
    }

    .flip-hint {
      margin-top: 18px;
      color: var(--text-3);
      font-size: 0.85rem;
    }

    .back {
      transform: rotateY(180deg);
      gap: 12px;
    }

    .picture {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 2 / 1;
      border-radius: var(--radius-md);
    }

    .translation {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.2;
    }

    .row {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .row-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-3);
    }

    .keyword {
      font-weight: 700;
      color: var(--accent-ink);
    }

    .scene,
    .example {
      color: var(--text);
      font-size: 0.95rem;
    }

    .example {
      color: var(--text-2);
      font-style: italic;
    }

    /* Japanese has no true italics; the browser would just slant the glyphs. */
    .example:lang(ja) {
      font-style: normal;
    }

    .example-reading {
      color: var(--text-3);
      font-size: 0.85rem;
    }

    .seg-keyword {
      font-weight: 700;
      color: var(--accent-ink);
      background: var(--accent-soft);
      border-radius: 3px;
      /* A shadow instead of padding, so a keyword inside a word ("quyoshim|san") doesn't look split off. */
      box-shadow: 0 0 0 2px var(--accent-soft);
    }

    .seg-meaning {
      font-weight: 700;
      text-decoration: underline;
      text-decoration-color: var(--accent);
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }

    .speak {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      background: var(--surface);
      color: var(--accent-ink);
      cursor: pointer;
      transition: background-color var(--transition-fast);

      &:hover {
        background: var(--accent-soft);
      }
    }

    .preview-note {
      color: var(--text-3);
      font-size: 0.875rem;
    }

    @media (max-width: 860px) {
      .steps {
        grid-template-columns: 1fr;
        gap: 8px;
      }
    }

    @media (max-width: 600px) {
      .vocab {
        padding: 20px 16px 40px;
        gap: 18px;
      }

      .flip {
        min-height: 300px;
      }

      .speak {
        width: 40px;
        height: 40px;
      }
    }
  `],
})
export class VocabularyComponent {
  private readonly i18n = inject(I18nService);

  readonly courses: Course[] = [
    { code: 'en', label: 'English', speechLang: 'en-US', cards: ENGLISH_CARDS },
    // Temporary demo, see vocabulary-japanese.data.ts.
    { code: 'ja', label: '日本語', speechLang: 'ja-JP', cards: JAPANESE_CARDS },
  ];
  readonly course = signal<Course>(this.courses[0]);

  readonly learnerLangs = LEARNER_LANGS;
  readonly partOfSpeechKeys: Record<VocabCard['partOfSpeech'], MessageKey> = {
    noun: 'vocab.noun',
    verb: 'vocab.verb',
    adjective: 'vocab.adjective',
    adverb: 'vocab.adverb',
  };
  readonly canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Follows the interface language until the user picks one explicitly.
  readonly chosenLearner = signal<LearnerLang | null>(null);
  readonly learner = computed<LearnerLang>(
    () => this.chosenLearner() ?? (this.i18n.lang() === 'ru' ? 'ru' : 'uz'),
  );

  readonly flipped = signal<ReadonlySet<number>>(new Set());

  private readonly sceneCache = new Map<string, SceneSegment[]>();

  selectCourse(course: Course) {
    this.course.set(course);
    this.flipped.set(new Set());
  }

  toggle(index: number) {
    this.flipped.update((set) => {
      const next = new Set(set);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }

  scene(text: string): SceneSegment[] {
    let segments = this.sceneCache.get(text);
    if (!segments) {
      segments = parseScene(text);
      this.sceneCache.set(text, segments);
    }
    return segments;
  }

  speak(card: VocabCard) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.kana ?? card.word);
    utterance.lang = this.course().speechLang;
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }
}
