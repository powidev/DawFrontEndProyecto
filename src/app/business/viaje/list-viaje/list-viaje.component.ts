import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../../Service/viaje.service';
import { Viaje } from '../../../Interface/viaje';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateViajeComponent } from '../create-viaje/create-viaje.component';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { Bus } from '../../../Interface/bus';
import { Destino } from '../../../Interface/destino';


@Component({
  selector: 'app-list-viaje',
  standalone: true,
  templateUrl: './list-viaje.component.html',
  styleUrls: ['./list-viaje.component.css'],
  imports: [CommonModule, ReactiveFormsModule, CreateViajeComponent]
})
export default class ListViajeComponent implements OnInit {
  viajes: Viaje[] = [];
  viajeSeleccionado: Viaje | null = null;

  constructor(private viajeService: ViajeService) {}

  ngOnInit(): void {
    this.cargarViajes();

  }

  cargarViajes() {
    this.viajeService.obtenerListaViajes().subscribe(
      (data: Viaje[]) => {
        console.log('Datos de viajes recibidos:', data);
        this.viajes = data;
      },
      (error) => console.error('Error al obtener viajes:', error)
    );
  }

  abrirModal() {
    this.viajeSeleccionado = null;
    const modalElement = document.getElementById('nuevoViajeModal');
    if (modalElement) new Modal(modalElement).show();
  }

  editarViaje(viaje: Viaje) {
    this.viajeSeleccionado = { ...viaje };
    const modalElement = document.getElementById('nuevoViajeModal');
    if (modalElement) new Modal(modalElement).show();
  }

  eliminarViaje(idViaje: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El viaje será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.viajeService.eliminarViaje(idViaje).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El viaje ha sido eliminado.', 'success');
          this.cargarViajes();
        });
      }
    });
  }
}