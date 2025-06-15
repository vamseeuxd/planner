import { Routes } from '@angular/router';

/* prettier-ignore */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then( (m) => m.DashboardComponent ), },
  { path: 'settings', loadComponent: () => import('./settings/settings').then( (m) => m.Settings ), },
  { path: 'account', loadComponent: () => import('./account/account').then( (m) => m.Account ), },
  { path: 'login', loadComponent: () => import('./login/login').then( (m) => m.Login ), },
];
