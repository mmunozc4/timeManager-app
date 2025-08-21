import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  loading = false;
  error: string | null = null;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['client', Validators.required],
      name: ['', Validators.required],
      phone: [''],
      address: ['']
    });
  }

  onRegister() {
    console.log(this.registerForm.value);
    
    if (this.registerForm.invalid){
      console.log(this.registerForm.errors);
      
      return 
    };

    this.loading = true;
    this.error = null;

    this.auth.register(this.registerForm.value).subscribe({
      next: (session) => {
        console.log('✅ Usuario registrado:', session);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo registrar';
        this.loading = false;
      }
    });
  }
}
