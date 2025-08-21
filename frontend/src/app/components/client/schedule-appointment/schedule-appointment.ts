import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-schedule-appointment',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.scss'
})
export class ScheduleAppointment implements OnInit {
  appointmentForm!: FormGroup;
  serviceId!: number;
  businessId!: number;
  serviceName: string = '';
  employees: any[] = [];
  availableHours: string[] = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  session: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.session = this.authService.getSession();
    this.route.paramMap.subscribe(params => {
      this.businessId = Number(params.get('businessId'));
      this.serviceId = Number(params.get('serviceId'));
    });
    // Si también necesitas el nombre del servicio desde query params
    this.serviceName = this.route.snapshot.queryParamMap.get('serviceName') || '';

    this.appointmentForm = this.fb.group({
      employeeId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    this.employeeService.getEmployeesByBusiness(this.businessId).subscribe({
      next: (res) => this.employees = res,
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    const clientId = this.session?.client_id;

    if (this.appointmentForm.valid) {
      const { employeeId, date, time } = this.appointmentForm.value;
      const appointment = {
        client_id: clientId,
        service_id: this.serviceId,
        business_id: this.businessId,
        employee_id: employeeId,
        appointment_time: `${date.toISOString().split('T')[0]}T${time}:00`
      };

      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          alert('Cita agendada correctamente');
          this.router.navigate(['/client/appointment-control']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
