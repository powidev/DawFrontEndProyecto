// Importa el modelo de Destino y Bus
import { Bus } from "./bus";
import { Destino } from "./destino";

export interface Viaje {
  idViaje: number;
  fechaSalida: string;
  fechaLlegada: string;
  incidencias: string | null;
  precio: number;
  bus: Bus; // Hace referencia al modelo de Bus
  destino: Destino; // Hace referencia al modelo de Destino
}
