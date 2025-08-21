import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-employee',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.scss'
})
export class AddEmployee {
  employeeForm: FormGroup;
  businessId: number | undefined; 

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    const session = this.authService.getSession();
    this.businessId = session?.business_id
    if (this.employeeForm.invalid) return;

    const payload = {
      ...this.employeeForm.value,
      business_id: this.businessId
    };

    this.employeeService.addEmployee(payload).subscribe({
      next: () => {
        alert('Empleado creado con éxito');
        this.router.navigate(['/business/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el empleado');
      }
    });
  }
}
