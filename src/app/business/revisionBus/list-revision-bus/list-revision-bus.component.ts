import { Component, OnInit } from '@angular/core';
import { RevisionBusService } from '../../../Service/revision-bus.service';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RevisionBus } from '../../../Interface/revisionBus';
import CreateRevisionbusComponent from '../create-revision-bus/create-revision-bus.component';

@Component({
  selector: 'app-list-revisionbus',
  standalone: true,
  templateUrl: './list-revision-bus.component.html',
  styleUrls: ['./list-revision-bus.component.css'],
  imports: [CommonModule, ReactiveFormsModule, CreateRevisionbusComponent]
})
export default class ListRevisionbusComponent implements OnInit {
  revisionBuses: RevisionBus[] = [];
  revisionSeleccionada: RevisionBus | null = null;

  constructor(private revisionBusService: RevisionBusService) {}

  ngOnInit(): void {
    this.cargarRevisiones();
  }

  cargarRevisiones() {
    this.revisionBusService.listar().subscribe(
      (data: RevisionBus[]) => {
        console.log('Datos de revisiones recibidos:', data);
        this.revisionBuses = data;
      },
      (error) => console.error('Error al obtener revisiones:', error)
    );
  }

  abrirModal() {
    this.revisionSeleccionada = null;
    const modalElement = document.getElementById('nuevaRevisionModal');
    if (modalElement) new Modal(modalElement).show();
  }

  editarRevision(revision: RevisionBus) {
    this.revisionSeleccionada = { ...revision };
    const modalElement = document.getElementById('nuevaRevisionModal');
    if (modalElement) new Modal(modalElement).show();
  }

  eliminarRevision(idRevision: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La revisión será eliminada permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.revisionBusService.eliminar(idRevision).subscribe(() => {
          Swal.fire('¡Eliminada!', 'La revisión ha sido eliminada.', 'success');
          this.cargarRevisiones();
        });
      }
    });
  }
}
