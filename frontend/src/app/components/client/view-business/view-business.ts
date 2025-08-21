import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-business',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './view-business.html',
  styleUrl: './view-business.scss'
})

export class ViewBusiness implements OnInit {

  businesses: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBusinesses();
  }

  getBusinesses() {
    this.loading = true;
    this.apiService.getBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudieron cargar los comercios';
        this.loading = false;
      }
    });
  }

  viewServices(businessId: number) {
    this.router.navigate(['public/view-services', businessId]);
  }
}
