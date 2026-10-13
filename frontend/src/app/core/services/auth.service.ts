import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { UserProfile, AuthResponse } from '../models/auth.models';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly isGuest = signal<boolean>(true);

  constructor() {
    this.initAuth();
  }

  initAuth() {
    const token = localStorage.getItem('mnemonic_token');
    const storedUser = localStorage.getItem('mnemonic_user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isGuest.set(user.isGuest);
        this.validateStoredToken();
        return;
      } catch (e) {
        localStorage.removeItem('mnemonic_token');
        localStorage.removeItem('mnemonic_user');
      }
    }

    // Auto-create guest user
    this.loginAsGuest().subscribe();
  }

  private validateStoredToken() {
    this.api.get<UserProfile>('auth/me').subscribe({
      next: (user) => {
        localStorage.setItem('mnemonic_user', JSON.stringify(user));
        this.currentUser.set(user);
        this.isGuest.set(user.isGuest);
      },
      error: (err) => {
        if (err?.status === 401) {
          localStorage.removeItem('mnemonic_token');
          localStorage.removeItem('mnemonic_user');
          this.loginAsGuest().subscribe();
        }
      },
    });
  }

  loginAsGuest() {
    return this.api.post<AuthResponse>('auth/guest', {}).pipe(
      tap((res) => {
        this.saveAuth(res);
      }),
      catchError((err) => {
        console.warn('Guest login offline/fallback', err);
        const fallbackUser: UserProfile = {
          id: 'guest_local',
          username: 'Guest Athlete',
          isGuest: true,
        };
        this.currentUser.set(fallbackUser);
        this.isAuthenticated.set(true);
        this.isGuest.set(true);
        return of(null);
      }),
    );
  }

  register(username: string, email: string, password: string) {
    return this.api.post<AuthResponse>('auth/register', { username, email, password }).pipe(
      tap((res) => this.saveAuth(res)),
    );
  }

  login(identifier: string, password: string) {
    return this.api.post<AuthResponse>('auth/login', { identifier, password }).pipe(
      tap((res) => this.saveAuth(res)),
    );
  }

  logout() {
    localStorage.removeItem('mnemonic_token');
    localStorage.removeItem('mnemonic_user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.loginAsGuest().subscribe();
  }

  private saveAuth(res: AuthResponse) {
    localStorage.setItem('mnemonic_token', res.accessToken);
    localStorage.setItem('mnemonic_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.isAuthenticated.set(true);
    this.isGuest.set(res.user.isGuest);
  }
}
