import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Viaje } from '../Interface/viaje';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  private baseUrl = "http://localhost:8090/api/viaje";

  constructor(private httpClient: HttpClient) {}

  // Obtener todos los viajes
  obtenerListaViajes(): Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.baseUrl}/listar`);
  }

  // Guardar un nuevo viaje
  agregarViaje(viaje: Viaje): Observable<Viaje> {
    return this.httpClient.post<Viaje>(`${this.baseUrl}/guardar`, viaje);
  }

  // Editar un viaje existente
  editarViaje(id: number, viaje: Viaje): Observable<Viaje> {
    return this.httpClient.put<Viaje>(`${this.baseUrl}/editar/${id}`, viaje);
  }

  // Eliminar un viaje por su ID
  eliminarViaje(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }
}