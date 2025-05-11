import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personal } from '../Interface/personal';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private baseUrl = 'http://localhost:8090/api/personal';

  constructor(private http: HttpClient) { }

  listar(): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.baseUrl}/listar`);
  }

  obtenerPorId(id: number): Observable<Personal> {
    return this.http.get<Personal>(`${this.baseUrl}/${id}`);
  }

  registrar(personal: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.baseUrl}/guardar`, personal);
  }

  actualizar(id: number, personal: Personal): Observable<Personal> {
    return this.http.put<Personal>(`${this.baseUrl}/editar/${id}`, personal);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }
}
