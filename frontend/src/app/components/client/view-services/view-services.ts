import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-services',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './view-services.html',
  styleUrl: './view-services.scss'
})
export class ViewServices {
  businessId!: number;
  services: any[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('businessId');
    this.businessId = idParam ? +idParam : 0;

    console.log(this.businessId);
    

    if (!this.businessId) {
      this.error = 'ID de comercio inválido';
      return;
    }
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = '';
    this.api.getServicesByBusiness(this.businessId).subscribe({
      next: (data) => {
        this.services = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando servicios', err);
        this.error = err?.error?.detail || 'No se pudieron cargar los servicios';
        this.loading = false;
      }
    });
  }

  bookService(serviceId: number) {
    this.router.navigate(['client/schedule-appointment', this.businessId, serviceId]);
  }

  navigateBefore(){
    this.router.navigate([''])
  }
}
