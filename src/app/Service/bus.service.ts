import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bus } from '../Interface/bus';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  
  private baseUrl="http://localhost:8090/api/bus"

  constructor(private httpClient:HttpClient) { }

  obtenerListaBuses(): Observable<Bus[]> {
    return this.httpClient.get<Bus[]>(`${this.baseUrl}/listar`);
  }
   // Agregar un nuevo bus
  agregarBus(bus: Bus): Observable<Bus> {
    return this.httpClient.post<Bus>(`${this.baseUrl}/guardar`, bus);
  }

  // Editar un bus existente
  editarBus(id: number, bus: Bus): Observable<Bus> {
    return this.httpClient.put<Bus>(`${this.baseUrl}/editar/${id}`, bus);
  }

  // Eliminar un bus por su ID
  eliminarBus(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }
}
