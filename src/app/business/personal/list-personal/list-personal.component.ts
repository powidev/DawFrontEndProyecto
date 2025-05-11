import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../Service/personal.service';
import { Personal } from '../../../Interface/personal';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import CreatePersonalComponent from '../create-personal/create-personal.component';

@Component({
  selector: 'app-list-personal',
  standalone: true,
  templateUrl: './list-personal.component.html',
  styleUrl: './list-personal.component.css',
  imports: [CommonModule, ReactiveFormsModule, CreatePersonalComponent]
})
export default class ListPersonalComponent implements OnInit {
  personalList: Personal[] = [];
  personalSeleccionado: Personal | null = null;

  constructor(private personalService: PersonalService) {}

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal() {
    this.personalService.listar().subscribe((data: Personal[]) => {
      this.personalList = data;
    });
  }

  abrirModal() {
    this.personalSeleccionado = null;
    const modalElement = document.getElementById('nuevoPersonalModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  editarPersonal(personal: Personal) {
    this.personalSeleccionado = { ...personal };
    const modalElement = document.getElementById('nuevoPersonalModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  eliminarPersonal(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el personal permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personalService.eliminar(id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El personal ha sido eliminado.', 'success');
          this.cargarPersonal();
        });
      }
    });
  }
}
