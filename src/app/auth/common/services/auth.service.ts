import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../models/user-login.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const JWT_TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = `${environment.url}/api/user`;

  private loginUrl: string = '/login';

  constructor(private http: HttpClient) { }

  login(user: UserLogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl + this.loginUrl, user)
      .pipe(
        map((result: {token: string}) => {
          localStorage.setItem(JWT_TOKEN_KEY, result.token);
          return result;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
  }

  getToken(): string {
    return localStorage.getItem(JWT_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  }
}
