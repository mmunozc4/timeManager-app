import { Routes } from '@angular/router';
import { ViewBusiness } from './client/view-business/view-business';
import { ViewServices } from './client/view-services/view-services';

export const PUBLIC_ROUTES: Routes = [
  { path: 'view-business', component: ViewBusiness },
  { path: 'view-services/:businessId', component: ViewServices },
];