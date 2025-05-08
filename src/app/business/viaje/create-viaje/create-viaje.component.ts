import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViajeService } from '../../../Service/viaje.service';
import { BusService } from '../../../Service/bus.service';
import { DestinoService } from '../../../Service/destino.service';
import { Viaje } from '../../../Interface/viaje';
import { Bus } from '../../../Interface/bus';
import { Destino } from '../../../Interface/destino';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-viaje',
  standalone: true,
  templateUrl: './create-viaje.component.html',
  styleUrls: ['./create-viaje.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateViajeComponent implements OnInit, OnChanges {
  @Input() viajeEditar: Viaje | null = null;
  @Output() viajeCreado = new EventEmitter<void>();

  formViaje: FormGroup;
  destinos: Destino[] = [];
  buses: Bus[] = [];

  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private busService: BusService,
    private destinoService: DestinoService
  ) {
    this.formViaje = this.fb.group({
      fechaSalida: ['', Validators.required],
      fechaLlegada: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      idDestino: [null, Validators.required],
      idBus: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['viajeEditar'] && this.viajeEditar) {
      // Asegúrate primero de que los destinos y buses estén cargados
      this.cargarDatos().then(() => {
        // Format dates for datetime-local input
        const fechaSalidaFormato = this.formatearFechaParaInput(this.viajeEditar?.fechaSalida);
        const fechaLlegadaFormato = this.formatearFechaParaInput(this.viajeEditar?.fechaLlegada);
  
        // Buscar el ID del destino basado en el nombre
        const destinoEncontrado = this.destinos.find(d => d.nombre === this.viajeEditar?.destino.nombre);  // Asegúrate de usar el nombre correcto
        const idDestino = destinoEncontrado ? destinoEncontrado.idDestino : null;
  
        // Buscar el ID del bus basado en la placa
        const busEncontrado = this.buses.find(b => b.modelo === this.viajeEditar?.bus.modelo);
        const idBus = busEncontrado ? busEncontrado.idBus : null;
  
        // Parchear el formulario con los datos de viaje
        this.formViaje.patchValue({
          fechaSalida: fechaSalidaFormato,
          fechaLlegada: fechaLlegadaFormato,
          precio: this.viajeEditar?.precio,
          idDestino: idDestino,
          idBus: idBus
        });
      });
    }
  }
  
  
  // Modifica el método cargarDatos para que devuelva una Promise
  cargarDatos(): Promise<void> {
    return new Promise<void>((resolve) => {
      forkJoin({
        destinos: this.destinoService.obtenerDestinos(),
        buses: this.busService.obtenerListaBuses()
      }).subscribe({
        next: ({ destinos, buses }) => {
          this.destinos = destinos;
          this.buses = buses;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
          resolve();  // Se resuelve aunque haya error, pero podrías manejarlo según sea necesario.
        }
      });
    });
  }
  formatearFechaParaInput(fechaStr: string | undefined): string {
    if (!fechaStr) return new Date().toISOString().slice(0, 16); // Retorna la fecha actual si fechaStr es falsy
    const fecha = new Date(fechaStr);
    return fecha.toISOString().slice(0, 16);
  }
  
  guardarViaje() {
    if (this.formViaje.valid) {
      const formData = this.formViaje.value;
      
      // Crear el objeto viaje que se enviará al servicio
      const viaje: any = {
        fechaSalida: formData.fechaSalida,
        fechaLlegada: formData.fechaLlegada,
        precio: formData.precio,
        idDestino: formData.idDestino,  // Enviar solo el idDestino, no el objeto
        idBus: formData.idBus  // Lo mismo para idBus
      };
      

      if (this.viajeEditar) {
        viaje.idViaje = this.viajeEditar.idViaje;
        this.viajeService.editarViaje(viaje.idViaje, viaje).subscribe({
          next: () => {
            Swal.fire('¡Editado!', 'El viaje ha sido actualizado.', 'success');
            this.viajeCreado.emit();
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al editar viaje:', err);
            Swal.fire('Error', 'No se pudo editar el viaje.', 'error');
          }
        });
      } else {
        this.viajeService.agregarViaje(viaje).subscribe({
          next: () => {
            Swal.fire('¡Guardado!', 'El viaje ha sido registrado.', 'success');
            this.viajeCreado.emit();
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al guardar viaje:', err);
            Swal.fire('Error', 'No se pudo guardar el viaje.', 'error');
          }
        });
      }
    } else {
      // Marca todos los campos como touched para mostrar los errores
      Object.keys(this.formViaje.controls).forEach(key => {
        this.formViaje.get(key)?.markAsTouched();
      });
      
      Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
    }
  }

  cerrarModal() {
    const modal = document.getElementById('nuevoViajeModal');
    if (modal) {
      const modalBootstrap = bootstrap.Modal.getInstance(modal);
      if (modalBootstrap) {
        modalBootstrap.hide();
      }
    }
    this.formViaje.reset();
  }
}