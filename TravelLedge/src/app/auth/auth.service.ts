// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl1 = 'http://localhost:3000/auth';
  private apiUrl2 = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  login(nombreUsuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl1}/login`, { nombreUsuario, password });
  }

  register(nombreUsuario: string, password: string, role: 'admin'): Observable<any> {
    return this.http.post(`${this.apiUrl1}/register`, {nombreUsuario, password, role});
  }

  getUsers(token: string): Observable<any> {
  const headers = { 'Authorization': `Bearer ${token}` }; 
  return this.http.get(`${this.apiUrl2}/getUsers`, { headers });
}
}