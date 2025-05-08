import { Component, OnInit } from '@angular/core';
import { DestinoService } from '../../../Service/destino.service';
import { Destino } from '../../../Interface/destino';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateDestinoComponent } from '../create-destino/create-destino.component';

@Component({
  selector: 'app-list-destino',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, CreateDestinoComponent],
  templateUrl: './list-destino.component.html',
  styleUrls: ['./list-destino.component.css']
})
export default class ListDestinoComponent implements OnInit {
  destinos: Destino[] = [];
  destinoSeleccionado: Destino | null = null;

  constructor(private destinoService: DestinoService) {}

  ngOnInit(): void {
    this.cargarDestinos();
  }

  cargarDestinos(): void {
    this.destinoService.obtenerDestinos().subscribe(
      (data) => this.destinos = data,
      (error) => console.error('Error al cargar destinos:', error)
    );
  }

  abrirModal(): void {
    this.destinoSeleccionado = null;
    const modalElement = document.getElementById('nuevoDestinoModal');
    if (modalElement) {
      const modal = new Modal(modalElement); // ✅ uso correcto
      modal.show();
    }
  }
  

  editarDestino(destino: Destino): void {
    this.destinoSeleccionado = { ...destino };
    const modalElement = document.getElementById('nuevoDestinoModal');
    if (modalElement) {
      const modal = new Modal(modalElement); // ✅ forma correcta
      modal.show();
    }
  }
  

  eliminarDestino(idDestino: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el destino permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.destinoService.eliminarDestino(idDestino).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El destino ha sido eliminado.', 'success');
          this.cargarDestinos();
        });
      }
    });
  }
}
