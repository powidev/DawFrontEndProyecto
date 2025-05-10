import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registrar } from '../../Interface/registrar';
import { Router } from '@angular/router';  // Importar Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  getProfile(): Observable<any> {
  return this.http.get<any>('http://localhost:8090/api/auth/profile');
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(request: Registrar): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
    console.log('Token eliminado');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
