import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ 
  providedIn: 'root' 
})
export class ApiService {
  baseUrl = '/api';
  constructor(private http: HttpClient) { }

  health(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments`);
  }

  getBusinesses() {
    return this.http.get<any[]>(`${this.baseUrl}/businesses`);
  }

  getServicesByBusiness(businessId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/services/by-business/${businessId}`);
  }

  
}
