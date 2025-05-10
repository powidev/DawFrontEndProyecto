import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  usuario: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.usuario = data;
        console.log('Perfil del usuario:', data);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }
}
