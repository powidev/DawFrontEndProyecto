import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusService } from '../../../Service/bus.service';
import { Bus } from '../../../Interface/bus';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-bus',
  standalone: true,
  templateUrl: './create-bus.component.html',
  styleUrls: ['./create-bus.component.css'],
  imports: [ReactiveFormsModule]
})
export class CreateBusComponent implements OnChanges {
  formBus: FormGroup;

  @Input() busEditar: Bus | null = null; // Bus seleccionado para editar
  @Output() busCreado = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private busService: BusService) {
    this.formBus = this.fb.group({
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(1900)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      placa: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busEditar'] && this.busEditar) {
      this.formBus.patchValue(this.busEditar); // Carga los valores en el form
    } else {
      this.formBus.reset(); // Si es null, limpia el form
    }
  }

  agregarBus() {
    if (this.formBus.invalid) return;
  
    if (this.busEditar) {
      this.busService.editarBus(this.busEditar.idBus, this.formBus.value).subscribe(() => {
        Swal.fire('¡Actualizado!', 'El bus fue editado correctamente.', 'success');
        this.busCreado.emit();
        this.cerrarModal();
      });
    } else {
      this.busService.agregarBus(this.formBus.value).subscribe(() => {
        Swal.fire('¡Registrado!', 'El nuevo bus ha sido agregado.', 'success');
        this.busCreado.emit();
        this.cerrarModal();
      });
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevoBusModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.busEditar = null;
    this.formBus.reset();
  }
}
