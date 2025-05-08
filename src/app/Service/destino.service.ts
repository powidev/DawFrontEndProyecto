import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destino } from '../Interface/destino';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  private apiUrl = 'http://localhost:8090/api/destino';

  constructor(private http: HttpClient) {}

  // Obtener todos los destinos
  obtenerDestinos(): Observable<Destino[]> {
    return this.http.get<Destino[]>(`${this.apiUrl}/listar`);
  }

  // Crear destino con imagen
  crearDestino(nombre: string, imagen: File): Observable<Destino> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('imagen', imagen);
    return this.http.post<Destino>(`${this.apiUrl}/crear`, formData);
  }

  // Editar destino (imagen opcional)
  actualizarDestino(id: number, nombre: string, imagen?: File): Observable<Destino> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return this.http.put<Destino>(`${this.apiUrl}/editar/${id}`, formData);
  }

  eliminarDestino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
  

}
