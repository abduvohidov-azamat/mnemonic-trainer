import { computed, effect, Injectable, signal } from '@angular/core';
import { en } from './messages/en';
import { uz } from './messages/uz';
import { ru } from './messages/ru';
import { Lang, MessageKey, MessageParams, Messages, PluralForms, PluralKey } from './i18n.types';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'uz', label: 'Oʻzbekcha' },
  { code: 'ru', label: 'Русский' },
];

const MESSAGES: Record<Lang, Messages> = { en, uz, ru };
const STORAGE_KEY = 'lang';

function isLang(value: unknown): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

// A saved choice wins; otherwise follow the browser's preferred languages.
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {}
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag?.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return 'en';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(detectLang());

  private readonly numberFormat = computed(
    () => new Intl.NumberFormat(this.lang(), { maximumFractionDigits: 2 }),
  );
  private readonly pluralRules = computed(() => new Intl.PluralRules(this.lang()));

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {}
    });
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
  }

  t(key: MessageKey, params?: MessageParams): string {
    return this.fill(this.lookup(key) as string, params);
  }

  tp(key: PluralKey, count: number, params?: MessageParams): string {
    const forms = this.lookup(key) as PluralForms;
    const form = forms[this.pluralRules().select(count) as keyof PluralForms] ?? forms.other;
    return this.fill(form, { n: count, ...params });
  }

  formatNumber(value: number): string {
    return this.numberFormat().format(value);
  }

  formatDate(value: string | number | Date, options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.lang(), options).format(new Date(value));
  }

  private lookup(key: MessageKey | PluralKey): string | PluralForms {
    const [section, name] = key.split('.');
    const messages = MESSAGES[this.lang()] as unknown as Record<string, Record<string, string | PluralForms>>;
    return messages[section][name];
  }

  private fill(message: string, params?: MessageParams): string {
    if (!params) return message;
    return message.replace(/\{(\w+)\}/g, (match, name: string) => {
      const value = params[name];
      if (value === undefined || value === null) return match;
      return typeof value === 'number' ? this.formatNumber(value) : value;
    });
  }
}
