import { DetalleVenta } from "./detalleVenta";

export interface Venta {
    cliente: string;
    detalles: DetalleVenta[];
}
