import { Bus } from "./bus";
import { Personal } from "./personal";

export interface RevisionBus {
  idRevision: number;
  fechaRevision: string; // formato ISO (yyyy-MM-dd)
  tipoRevision: string;
  resultado: string;
  observaciones?: string | null;
  bus: Bus;
  personal: Personal;
}
