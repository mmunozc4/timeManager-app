import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Services } from '../../../services/services.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-service',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-service.html',
  styleUrl: './add-service.scss'
})
export class AddService {
  serviceForm: FormGroup;
  businessId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private services: Services,
    private router: Router,
    private authService: AuthService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    const session = this.authService.getSession();
    this.businessId = session?.business_id
    
    if (this.serviceForm.invalid) {
      return;
    }

    const payload = {
      ...this.serviceForm.value,
      business_id: this.businessId
    };

    this.services.addService(payload).subscribe({
      next: () => {
        alert('Servicio creado con éxito');
        this.router.navigate(['/business/appointments']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el servicio');
      }
    });
  }
}
