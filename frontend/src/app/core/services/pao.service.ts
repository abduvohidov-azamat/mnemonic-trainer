import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { PaoEntry, PaoMatrixResponse } from '../models/pao.models';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaoService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly userId = computed(() => this.auth.currentUser()?.id ?? null);

  readonly numbersPao = signal<PaoEntry[]>([]);
  readonly cardsPao = signal<PaoEntry[]>([]);
  readonly isLoading = signal<boolean>(false);

  // Fast O(1) lookup map for active locus PAO hints
  readonly paoLookupMap = computed(() => {
    const map = new Map<string, PaoEntry>();
    for (const item of this.numbersPao()) {
      map.set(item.key, item);
    }
    for (const item of this.cardsPao()) {
      map.set(item.key, item);
    }
    return map;
  });

  constructor() {
    effect(
      () => {
        this.userId();
        this.loadPaoMatrix();
      },
      { allowSignalWrites: true },
    );
  }

  loadPaoMatrix() {
    this.isLoading.set(true);
    return this.api.get<PaoMatrixResponse>('pao').pipe(
      tap((res) => {
        this.numbersPao.set(res.numbers || []);
        this.cardsPao.set(res.cards || []);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.warn('Failed to load PAO from backend, using fallback', err);
        this.isLoading.set(false);
        return of({ numbers: [], cards: [] });
      }),
    ).subscribe();
  }

  updateEntry(key: string, data: Partial<PaoEntry>) {
    return this.api.put<PaoEntry>(`pao/${key}`, data).pipe(
      tap((updated) => {
        if (updated.type === 'number') {
          this.numbersPao.update((list) =>
            list.map((item) => (item.key === key ? { ...item, ...updated, isCustom: true } : item)),
          );
        } else {
          this.cardsPao.update((list) =>
            list.map((item) => (item.key === key ? { ...item, ...updated, isCustom: true } : item)),
          );
        }
      }),
    );
  }

  resetToDefault() {
    return this.api.post<{ success: boolean }>('pao/reset', {}).pipe(
      tap(() => this.loadPaoMatrix()),
    );
  }

  getHintForChunk(chunk: string): PaoEntry | null {
    return this.paoLookupMap().get(chunk) || null;
  }
}
