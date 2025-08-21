import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  baseUrl = '/api/appointments';;
  constructor(private http: HttpClient) { }

  createAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getAppointmentsByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getAppointmentsByBusiness(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business/${businessId}`);
  }

  acceptAppointment(appointmentId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${appointmentId}/accept`, { status });
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${appointmentId}/cancel`, { status });
  }

}