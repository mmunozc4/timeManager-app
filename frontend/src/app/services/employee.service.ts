import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = '/api/employees';;
  constructor(private http: HttpClient) { }

  getEmployeesByBusiness(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/by-business/${businessId}`);
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(this.baseUrl, employeeData);
  }
}
