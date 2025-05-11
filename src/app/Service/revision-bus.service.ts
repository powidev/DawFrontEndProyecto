import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RevisionBus } from '../Interface/revisionBus';

@Injectable({
  providedIn: 'root'
})
export class RevisionBusService {

  private baseUrl = 'http://localhost:8090/api/revision';

  constructor(private http: HttpClient) { }

  listar(): Observable<RevisionBus[]> {
    return this.http.get<RevisionBus[]>(`${this.baseUrl}/listar`);
  }

  obtenerPorId(id: number): Observable<RevisionBus> {
    return this.http.get<RevisionBus>(`${this.baseUrl}/${id}`);
  }

  registrar(revision: RevisionBus): Observable<RevisionBus> {
    return this.http.post<RevisionBus>(`${this.baseUrl}/guardar`, revision);
  }

  actualizar(id: number, revision: RevisionBus): Observable<RevisionBus> {
    return this.http.put<RevisionBus>(`${this.baseUrl}/editar/${id}`, revision);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }
}
