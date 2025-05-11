import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalService } from '../../../Service/personal.service';
import { Personal } from '../../../Interface/personal';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-personal',
  standalone: true,
  templateUrl: './create-personal.component.html',
  styleUrl: './create-personal.component.css',
  imports: [ReactiveFormsModule]
})
export default class CreatePersonalComponent implements OnChanges {
  formPersonal: FormGroup;

  @Input() personalEditar: Personal | null = null;
  @Output() personalGuardado = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private personalService: PersonalService) {
    this.formPersonal = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      cargo: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personalEditar'] && this.personalEditar) {
      this.formPersonal.patchValue(this.personalEditar);
    } else {
      this.formPersonal.reset();
    }
  }

  guardarPersonal() {
    if (this.formPersonal.invalid) return;

    if (this.personalEditar) {
      this.personalService.actualizar(this.personalEditar.id, this.formPersonal.value).subscribe(() => {
        Swal.fire('¡Actualizado!', 'El personal fue actualizado correctamente.', 'success');
        this.personalGuardado.emit();
        this.cerrarModal();
      });
    } else {
      this.personalService.registrar(this.formPersonal.value).subscribe(() => {
        Swal.fire('¡Registrado!', 'El personal fue registrado correctamente.', 'success');
        this.personalGuardado.emit();
        this.cerrarModal();
      });
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevoPersonalModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.personalEditar = null;
    this.formPersonal.reset();
  }
}
