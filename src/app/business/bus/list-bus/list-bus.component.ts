// list-bus.component.ts
import { Component, OnInit } from '@angular/core';
import { BusService } from '../../../Service/bus.service';
import { Bus } from '../../../Interface/bus';
import { Modal } from 'bootstrap'; // Para trabajar con el modal de Bootstrap
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBusComponent } from '../create-bus/create-bus.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-bus',
  standalone: true, // Marca el componente como standalone
  templateUrl: './list-bus.component.html',
  styleUrls: ['./list-bus.component.css'],
  imports: [CommonModule, ReactiveFormsModule,CreateBusComponent] // Asegúrate de importar el servicio directamente
})
export default class ListBusComponent implements OnInit {
  buses: Bus[] = [];
  busSeleccionado: Bus | null = null;

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    this.cargarBuses();
  }

  cargarBuses() {
    this.busService.obtenerListaBuses().subscribe(
      (data: Bus[]) => {
        this.buses = data;
      },
      (error) => {
        console.error('Error al obtener los buses:', error);
      }
    );
  }

  abrirModal() {
    this.busSeleccionado = null; // Reset para creación
    const modalElement = document.getElementById('nuevoBusModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }


  editarBus(bus: Bus) {
    this.busSeleccionado = { ...bus }; // Copia para evitar mutaciones
    const modalElement = document.getElementById('nuevoBusModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

 
  eliminarBus(idBus: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bus permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.busService.eliminarBus(idBus).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El bus ha sido eliminado.', 'success');
          this.cargarBuses();
        });
      }
    });
  }
}
