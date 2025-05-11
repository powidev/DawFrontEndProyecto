import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common'; // Para importar directivas comunes

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],  // Usamos CommonModule para las directivas comunes de Angular
  templateUrl: './profile.component.html',  // Asegúrate de que la ruta sea correcta
  styleUrls: ['./profile.component.css']  // Estilo corregido: "styleUrls" en plural
})
export default class ProfileComponent implements OnInit {
  usuario: any; // Este será el objeto donde se guardan los datos del perfil

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Llamamos al servicio para obtener el perfil del usuario
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.usuario = data; // Asignamos los datos al objeto usuario
        console.log('Perfil del usuario:', data); // Para comprobar que estamos recibiendo los datos correctamente
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err); // Mostramos error en consola en caso de fallo
      }
    });
  }
}
