import { Routes } from '@angular/router';
import { AppointmentControl } from './appointment-control/appointment-control';
import { RateService } from './rate-service/rate-service';
import { ScheduleAppointment } from './schedule-appointment/schedule-appointment';

export const CLIENT_ROUTES: Routes = [
  { path: 'appointment-control', component: AppointmentControl },
  { path: 'rate-service', component: RateService },
  { path: 'achedule', component: ScheduleAppointment },
];