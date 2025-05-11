import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RevisionBusService } from '../../../Service/revision-bus.service';
import { BusService } from '../../../Service/bus.service';
import { PersonalService } from '../../../Service/personal.service';
import { Bus } from '../../../Interface/bus';
import { Personal } from '../../../Interface/personal';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-revisionbus',
  standalone: true,
  templateUrl: './create-revision-bus.component.html',
  styleUrls: ['./create-revision-bus.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export default class CreateRevisionbusComponent implements OnInit, OnChanges {
  @Input() revisionEditar: any;
  @Output() revisionCreada = new EventEmitter<void>();

  formRevision: FormGroup;
  buses: Bus[] = [];
  personal: Personal[] = [];

  constructor(
    private fb: FormBuilder,
    private revisionBusService: RevisionBusService,
    private busService: BusService,
    private personalService: PersonalService
  ) {
    this.formRevision = this.fb.group({
      fechaRevision: ['', Validators.required],
      tipoRevision: ['', Validators.required],
      resultado: ['', Validators.required],
      observaciones: [''],
      idBus: [null, Validators.required],
      idPersonal: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['revisionEditar'] && this.revisionEditar) {
      this.formRevision.patchValue({
        fechaRevision: this.formatearFechaParaInput(this.revisionEditar.fechaRevision),
        tipoRevision: this.revisionEditar.tipoRevision,
        resultado: this.revisionEditar.resultado,
        observaciones: this.revisionEditar.observaciones,
        idBus: this.revisionEditar.bus.idBus,
        idPersonal: this.revisionEditar.personal.id
      });
    }
  }

  cargarDatos(): Promise<void> {
    return new Promise<void>((resolve) => {
      forkJoin({
        buses: this.busService.obtenerListaBuses(),
        personal: this.personalService.listar()
      }).subscribe({
        next: ({ buses, personal }) => {
          this.buses = buses;
          this.personal = personal;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
          resolve();
        }
      });
    });
  }

  formatearFechaParaInput(fechaStr: string | undefined): string {
    if (!fechaStr) return new Date().toISOString().slice(0, 16);
    const fecha = new Date(fechaStr);
    return fecha.toISOString().slice(0, 16);
  }

  guardarRevision() {
    if (this.formRevision.valid) {
      const formData = this.formRevision.value;
      const revision: any = {
        fechaRevision: formData.fechaRevision,
        tipoRevision: formData.tipoRevision,
        resultado: formData.resultado,
        observaciones: formData.observaciones,
        bus: { idBus: formData.idBus },
        personal: { id: formData.idPersonal }
      };

      if (this.revisionEditar) {
        revision.idRevision = this.revisionEditar.idRevision;
        this.revisionBusService.actualizar(revision.idRevision, revision).subscribe({
          next: () => {
            Swal.fire('¡Editada!', 'La revisión ha sido actualizada.', 'success');
            this.revisionCreada.emit();
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al editar revisión:', err);
            Swal.fire('Error', 'No se pudo editar la revisión.', 'error');
          }
        });
      } else {
        this.revisionBusService.registrar(revision).subscribe({
          next: () => {
            Swal.fire('¡Guardada!', 'La revisión ha sido registrada.', 'success');
            this.revisionCreada.emit();
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al guardar revisión:', err);
            Swal.fire('Error', 'No se pudo guardar la revisión.', 'error');
          }
        });
      }
    } else {
      Object.keys(this.formRevision.controls).forEach(key => {
        this.formRevision.get(key)?.markAsTouched();
      });
      Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
    }
  }

  cerrarModal() {
    const modal = document.getElementById('nuevaRevisionModal');
    if (modal) {
      const modalBootstrap = bootstrap.Modal.getInstance(modal);
      if (modalBootstrap) {
        modalBootstrap.hide();
      }
    }
    this.formRevision.reset();
  }
}
