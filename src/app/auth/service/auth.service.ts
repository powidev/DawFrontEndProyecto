import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registrar } from '../../Interface/registrar';

@Injectable({
  providedIn: 'root'// Esto hace que Angular cree una sola instancia (Singleton)
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/api/auth'

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
  
  register(request: Registrar): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, request);
  }
  
  logout(): void {
    localStorage.removeItem('token');
  }
  isAutheticated(): boolean{
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
