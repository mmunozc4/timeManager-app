import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScheduleAppointment } from '../schedule-appointment/schedule-appointment';

@Component({
  selector: 'app-view-services',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './view-services.html',
  styleUrl: './view-services.scss'
})
export class ViewServices {
  businessId!: number;
  services: any[] = [];
  loading = false;
  error = '';
  private history: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('businessId');
    this.businessId = idParam ? +idParam : 0;
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

  navigateBefore() {
    this.history.pop();
    if (this.history.length > 0) {
      this.router.navigateByUrl(this.history[this.history.length - 1]);
    } else {
      this.router.navigateByUrl('/public/view-business');
    }
  }

  openAppointmentSchedule(serviceId: number, serviceName: string): void {
    const dialogRef = this.dialog.open(ScheduleAppointment, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        businessId: this.businessId,
        serviceId: serviceId,
        serviceName: serviceName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.loadServices();
      }
    });
  }
}
