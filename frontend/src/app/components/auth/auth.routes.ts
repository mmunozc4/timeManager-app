import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];