import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const AUTH_KEY = 'catcova_auth';

export interface AuthUser {
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<AuthUser | null>(null);
  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  /** LOGIN — devuelve Observable<AuthUser> */
  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthUser>(`${environment.apiUrl}/auth/login`, credentials);
  }

  /** Guarda sesión */
  setSession(user: AuthUser) {
    this._user.set(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem(AUTH_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  getUser(): AuthUser | null {
    return this._user();
  }

  private restoreSession() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return;

      const user = JSON.parse(raw);
      if (user?.token) {
        this._user.set(user);
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }
  
  getToken(): string | null {
  return this._user()?.token ?? null;
}
}