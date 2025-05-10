import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();  // Llama al método logout de tu servicio Auth
    this.router.navigate(['/login']);  // Redirige al login después de cerrar sesión
  }
}
