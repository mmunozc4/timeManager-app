import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-appointment-control',
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './appointment-control.html',
  styleUrl: './appointment-control.scss'
})
export class AppointmentControl implements OnInit {

  appointments: any[] = [];
  loading = true;
  errorMessage = '';
  session: any;

  constructor(
    private appointmentService: AppointmentService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    this.loadAppointments();
  }

  loadAppointments() {
    const clientId = this.session?.client_id;
    this.loading = true;
    this.errorMessage = '';

    this.appointmentService.getAppointmentsByClient(clientId).subscribe({
      next: (res) => {
        this.appointments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudieron cargar las citas.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'ACCEPTED':
        return 'status-accepted';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
