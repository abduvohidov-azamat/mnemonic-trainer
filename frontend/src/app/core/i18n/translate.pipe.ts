import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';
import { MessageKey, MessageParams, PluralKey } from './i18n.types';

// Impure so the text updates as soon as the language changes; each call is a cheap lookup.
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: MessageKey, params?: MessageParams): string {
    return this.i18n.t(key, params);
  }
}

@Pipe({ name: 'tp', standalone: true, pure: false })
export class TranslatePluralPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: PluralKey, count: number, params?: MessageParams): string {
    return this.i18n.tp(key, count, params);
  }
}
