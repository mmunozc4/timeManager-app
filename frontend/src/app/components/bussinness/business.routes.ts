import { Routes } from '@angular/router';
import { AddEmployee } from './add-employee/add-employee';
import { AddService } from './add-service/add-service';
import { Analytics } from './analytics/analytics';
import { EmployeesDashboard } from './employees-dashboard/employees-dashboard';
import { ListAppointmennt } from './list-appointmennt/list-appointmennt';
import { ListClients } from './list-clients/list-clients';
import { ServicesDashboard } from './services-dashboard/services-dashboard';

export const BUSINESS_ROUTES: Routes = [
  { path: 'appointments', component: ListAppointmennt },
  { path: 'add-service', component: AddService },
  { path: 'add-employee', component: AddEmployee },
  { path: 'services', component: ServicesDashboard },
  { path: 'employees', component: EmployeesDashboard },
  { path: 'analytics', component: Analytics },
  { path: 'clients', component: ListClients },
];