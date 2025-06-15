import { Routes } from '@angular/router';

/* prettier-ignore */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then( (m) => m.DashboardComponent ), },
  { path: 'settings', loadComponent: () => import('./settings/settings').then( (m) => m.Settings ), },
  { path: 'account', loadComponent: () => import('./account/account').then( (m) => m.Account ), },
  { path: 'login', loadComponent: () => import('./login/login').then( (m) => m.Login ), },
  { path: 'expenses', loadComponent: () => import('./expenses/expenses').then( (m) => m.Expenses ), },
  { path: 'incomes', loadComponent: () => import('./incomes/incomes').then( (m) => m.Incomes ), },
  { path: 'credit-cards', loadComponent: () => import('./credit-cards/credit-cards').then( (m) => m.CreditCards ), },
  { path: 'chit-fund', loadComponent: () => import('./chit-fund/chit-fund').then( (m) => m.ChitFund ), },
  { path: 'loans', loadComponent: () => import('./loans/loans').then( (m) => m.Loans ), },
];
