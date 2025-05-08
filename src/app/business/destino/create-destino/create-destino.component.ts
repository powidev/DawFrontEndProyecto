import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DestinoService } from '../../../Service/destino.service';
import { Destino } from '../../../Interface/destino';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-destino',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './create-destino.component.html',
  styleUrls: ['./create-destino.component.css']
})
export class CreateDestinoComponent implements OnChanges {
  @Input() destinoEditar: Destino | null = null;
  @Output() destinoCreado = new EventEmitter<void>();

  formDestino: FormGroup;
  imagenFile: File | null = null;

  constructor(private fb: FormBuilder, private destinoService: DestinoService) {
    this.formDestino = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destinoEditar'] && this.destinoEditar) {
      this.formDestino.patchValue({
        nombre: this.destinoEditar.nombre
      });
    } else {
      this.formDestino.reset();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
    }
  }

  agregarDestino(): void {
    if (this.formDestino.invalid) return;
  
    const nombre = this.formDestino.value.nombre;
  
    if (this.destinoEditar) {
      // Modo edición
      this.destinoService.actualizarDestino(this.destinoEditar.idDestino, nombre, this.imagenFile!).subscribe(() => {
        Swal.fire('Actualizado', 'Destino actualizado con éxito', 'success');
        this.destinoCreado.emit();
        this.formDestino.reset();
        this.imagenFile = null;
      });
    } else {
      // Modo creación
      this.destinoService.crearDestino(nombre, this.imagenFile!).subscribe(() => {
        Swal.fire('Creado', 'Destino creado con éxito', 'success');
        this.destinoCreado.emit();
        this.formDestino.reset();
        this.imagenFile = null;
      });
    }
  }
  
}
