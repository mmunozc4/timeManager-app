import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environments';
import { SecureStorage } from './secure-storage.service';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface SessionUser {
  token: string;
  email: string;
  role: 'client' | 'business';
  client_id?: number;
  business_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/auth';
  private sessionKey = 'session';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  // Observable para que los componentes reaccionen
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private secure: SecureStorage) {
    // Verificar si ya hay sesión al iniciar
    const session = this.secure.get(this.sessionKey);
    this._isLoggedIn.next(!!session);
  }

  // =============================
  // LOGIN
  // =============================
  login(credentials: { email: string; password: string }): Observable<SessionUser> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/login`, credentials).pipe(
      switchMap(res => {
        // Guardar token temporal
        this.secure.set(this.sessionKey, { token: res.access_token });

        // Obtener perfil del usuario
        return this.http.get<{
          email: string;
          role: 'client' | 'business';
          client_id?: number;
          business_id?: number;
        }>(`${this.baseUrl}/me`).pipe(
          map(profile => {
            const session: SessionUser = {
              token: res.access_token,
              email: profile.email,
              role: profile.role,
              client_id: profile.client_id,
              business_id: profile.business_id
            };

            // Guardar sesión completa
            this.secure.set(this.sessionKey, session);
            this._isLoggedIn.next(true);   // ✅ notificar login
            return session;
          })
        );
      })
    );
  }

  // =============================
  // REGISTER
  // =============================
  register(data: { email: string; password: string; role: string }): Observable<SessionUser> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/register`, data).pipe(
      switchMap(res => {
        this.secure.set(this.sessionKey, { token: res.access_token });

        return this.http.get<{
          email: string;
          role: 'client' | 'business';
          client_id?: number;
          business_id?: number;
        }>(`${this.baseUrl}/me`).pipe(
          map(profile => {
            const session: SessionUser = {
              token: res.access_token,
              email: profile.email,
              role: profile.role,
              client_id: profile.client_id,
              business_id: profile.business_id
            };

            this.secure.set(this.sessionKey, session);
            this._isLoggedIn.next(true);   
            console.log(session);
            
            return session;
          })
        );
      })
    );
  }

  // =============================
  // LOGOUT
  // =============================
  logout(): void {
    this.secure.remove(this.sessionKey);
    this._isLoggedIn.next(false);  // ✅ notificar logout
  }

  // =============================
  // SESIÓN
  // =============================
  getSession(): SessionUser | null {
    return this.secure.get(this.sessionKey);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }
}
