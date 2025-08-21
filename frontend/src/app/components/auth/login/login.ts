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
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit{
  loading = false;
  error: string | null = null;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;

    this.auth.login(this.loginForm.value).subscribe({
next: (session) => {
      console.log('✅ Sesión iniciada:', session);
      this.loading = false;
      if (session.role === 'client') {
        this.router.navigate(['client/appointment-control']); 
      } else if (session.role === 'business') {
        this.router.navigate(['business/appointments']); 
      } else {
        this.router.navigate(['/']); 
      }
    },
      error: () => {
        this.error = 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
