import { Routes } from '@angular/router';

/* prettier-ignore */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
  { data:{title:'Dashboard'}, path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then( (m) => m.DashboardComponent ), },
  { data:{title:'Settings'}, path: 'settings', loadComponent: () => import('./settings/settings').then( (m) => m.Settings ), },
  { data:{title:'Account'}, path: 'account', loadComponent: () => import('./account/account').then( (m) => m.Account ), },
  { data:{title:'Login'}, path: 'login', loadComponent: () => import('./login/login').then( (m) => m.Login ), },
  { data:{title:'Expenses'}, path: 'expenses', loadComponent: () => import('./expenses/expenses').then( (m) => m.Expenses ), },
  { data:{title:'Incomes'}, path: 'incomes', loadComponent: () => import('./incomes/incomes').then( (m) => m.Incomes ), },
  { data:{title:'Credit-Cards'}, path: 'credit-cards', loadComponent: () => import('./credit-cards/credit-cards').then( (m) => m.CreditCards ), },
  { data:{title:'Chit-Fund'}, path: 'chit-fund', loadComponent: () => import('./chit-fund/chit-fund').then( (m) => m.ChitFund ), },
  { data:{title:'Loans'}, path: 'loans', loadComponent: () => import('./loans/loans').then( (m) => m.Loans ), },
];
