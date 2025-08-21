import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { RoleGuard } from './guards/role-guard.guard';

import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

import { ViewBusiness } from './components/client/view-business/view-business';
import { ViewServices } from './components/client/view-services/view-services';
import { AppointmentControl } from './components/client/appointment-control/appointment-control';
import { RateService } from './components/client/rate-service/rate-service';
import { ScheduleAppointment } from './components/client/schedule-appointment/schedule-appointment';
import { AddService } from './components/bussinness/add-service/add-service';
import { ListAppointmennt } from './components/bussinness/list-appointmennt/list-appointmennt';
import { ServicesDashboard } from './components/bussinness/services-dashboard/services-dashboard';
import { EmployeesDashboard } from './components/bussinness/employees-dashboard/employees-dashboard';
import { AddEmployee } from './components/bussinness/add-employee/add-employee';
import { Analytics } from './components/bussinness/analytics/analytics';
import { ListClients } from './components/bussinness/list-clients/list-clients';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: 'public',
    children: [
      { path: 'view-business', component: ViewBusiness },
      { path: 'view-services/:businessId', component: ViewServices },
    ],
  },
  {
    path: 'client',
    children: [
      { path: 'appointment-control', component: AppointmentControl },
      { path: 'rate-service', component: RateService },
      { path: 'schedule-appointment/:businessId/:serviceId', component: ScheduleAppointment },
    ],
    canActivate: [AuthGuard, RoleGuard('client')],
  },
  {
    path: 'business',
    children: [
      { path: 'appointments', component: ListAppointmennt },
      { path: 'add-service', component: AddService },
      { path: 'add-employee', component: AddEmployee },
      { path: 'services', component: ServicesDashboard },
      { path: 'employees', component: EmployeesDashboard },
      { path: 'analytics', component: Analytics },
      { path: 'clients', component: ListClients },
    ],
    canActivate: [AuthGuard, RoleGuard('business')],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
