import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrarComponent } from './auth/registrar/registrar.component';
import DashboardComponent from './business/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '',
        loadComponent: () => import('./shared/components/layout/layout.component') },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrarComponent },
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component')
            },
            {
                path: 'profile',
                loadComponent: () => import('./business/profile/profile.component')

            },
            {
                path: 'bus',
                loadComponent: () => import('./business/bus/list-bus/list-bus.component')
            },
            {
                path: 'destino',
                loadComponent: () => import('./business/destino/list-destino/list-destino.component')
            },
            {
                path: 'viaje',
                loadComponent: () => import('./business/viaje/list-viaje/list-viaje.component'),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

