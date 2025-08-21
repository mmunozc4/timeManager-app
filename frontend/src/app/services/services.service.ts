import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Services {
  baseUrl = '/api/services';;
  constructor(private http: HttpClient) { }

  addService(serviceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, serviceData);
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  
}

