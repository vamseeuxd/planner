import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

/* prettier-ignore */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
  { data:{title:'Login'}, path: 'login', loadComponent: () => import('./login/login').then( (m) => m.Login ), },
  { data:{title:'Signup'}, path: 'signup', loadComponent: () => import('./signup/signup').then( (m) => m.Signup ), },
  { data:{title:'Reset-Password'}, path: 'reset-password', loadComponent: () => import('./reset-password/reset-password').then( (m) => m.ResetPassword ), },
  { canActivate: [authGuard], data:{title:'Dashboard'}, path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then( (m) => m.DashboardComponent ), },
  { canActivate: [authGuard], data:{title:'Settings'}, path: 'settings', loadComponent: () => import('./settings/settings').then( (m) => m.Settings ), },
  { canActivate: [authGuard], data:{title:'Account'}, path: 'account', loadComponent: () => import('./account/account').then( (m) => m.Account ), },
  { canActivate: [authGuard], data:{title:'Expenses'}, path: 'expenses', loadComponent: () => import('./expenses/expenses').then( (m) => m.ExpensesComponent ), },
  { canActivate: [authGuard], data:{title:'Incomes'}, path: 'incomes', loadComponent: () => import('./incomes/incomes').then( (m) => m.Incomes ), },
  { canActivate: [authGuard], data:{title:'Credit-Cards'}, path: 'credit-cards', loadComponent: () => import('./credit-cards/credit-cards').then( (m) => m.CreditCards ), },
  { canActivate: [authGuard], data:{title:'Chit-Fund'}, path: 'chit-fund', loadComponent: () => import('./chit-fund/chit-fund').then( (m) => m.ChitFund ), },
  { canActivate: [authGuard], data:{title:'Loans'}, path: 'loans', loadComponent: () => import('./loans/loans').then( (m) => m.Loans ), },
  { canActivate: [authGuard], data:{title:'Bank-Accounts'}, path: 'bank-accounts', loadComponent: () => import('./bank-accounts/bank-accounts').then( (m) => m.BankAccounts ), },
  { canActivate: [authGuard], data:{title:'Expense Categories'}, path: 'expenses-categories', loadComponent: () => import('./expenses-categories/expenses-categories').then( (m) => m.ExpensesCategories ), },
  { canActivate: [authGuard], data:{title:'Income Categories'}, path: 'incomes-categories', loadComponent: () => import('./incomes-categories/incomes-categories').then( (m) => m.IncomesCategories ), },
];
