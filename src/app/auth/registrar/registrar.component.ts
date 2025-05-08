import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Llamar al servicio AuthService para registrar el usuario
    const request = {
      username: this.username,
      password: this.password
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito', response);
        this.successMessage = response.message;
       // El mensaje que regrese el backend
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirige al login después de un breve mensaje
      },
      error: (error) => {
        console.error('Error al registrar el usuario', error);
        this.errorMessage = 'Error al registrar el usuario. Inténtalo nuevamente.';
      }
    });
  }
}
