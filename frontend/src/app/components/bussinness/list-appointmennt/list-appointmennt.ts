import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-appointmennt',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './list-appointmennt.html',
  styleUrl: './list-appointmennt.scss'
})
export class ListAppointmennt implements OnInit {
  loading: boolean = true;
  errorMessage: string | null = null;
  appointments: any[] = [];
  filteredAppointments = new MatTableDataSource<any>();;
  filterForm!: FormGroup;
  businessId: number | undefined;
  session: any;

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.session = this.authService.getSession();

    this.filterForm = this.fb.group({
      date: [''],
      status: [''],
      client: [''],
    });

    this.loadAppointments();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadAppointments(): void {
    this.loading = true;
    this.errorMessage = null;
    this.businessId = this.session?.business_id
    if (this.businessId != undefined) {
      this.appointmentService.getAppointmentsByBusiness(this.businessId).subscribe({
        next: (data) => {
          this.appointments = data;
          this.filteredAppointments.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando citas', err);
          this.errorMessage = 'No se pudieron cargar las citas. Intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
    }
  }

  applyFilters(): void {
    const { date, status, client, employee } = this.filterForm.value;

    const filteredData = this.appointments.filter(appt => {
      const matchDate = date ? new Date(appt.appointment_time).toDateString() === new Date(date).toDateString() : true;
      const matchStatus = status ? appt.status.toLowerCase() === status.toLowerCase() : true;
      const matchClient = client ? appt.client?.full_name.toLowerCase().includes(client.toLowerCase()) : true;
      const matchEmployee = employee ? appt.employee?.name.toLowerCase().includes(employee.toLowerCase()) : true;
      return matchDate && matchStatus && matchClient && matchEmployee;
    });

    this.filteredAppointments.data = filteredData;
  }

  updateStatus(appointmentId: number, status: string): void {
    let updateObservable: Observable<any> | null = null;

    if (status === 'accepted') {
      updateObservable = this.appointmentService.acceptAppointment(appointmentId);
    } else if (status === 'cancelled') {
      updateObservable = this.appointmentService.cancelAppointment(appointmentId);
    } else {
      console.error('Estado no válido:', status);
      return;
    }

    if (!updateObservable) {
      console.error('No se pudo crear el observable para actualizar el estado');
      return;
    }

    updateObservable.subscribe({
      next: () => {
        const appt = this.appointments.find(a => a.id === appointmentId);
        if (appt) appt.status = status;
        this.applyFilters();
        alert(`Cita ${status} con éxito`);
      },
      error: (err) => console.error('Error actualizando cita', err)
    });
  }

  private showCustomMessage(message: string, type: 'success' | 'error' | 'info'): void {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    if (type === 'error') {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000);
    } else if (type === 'success') {
      console.log(`Éxito: ${message}`);
    }
  }

  getStatusClass(status: string): string {
    return status ? status.toLowerCase() : '';
  }

}

