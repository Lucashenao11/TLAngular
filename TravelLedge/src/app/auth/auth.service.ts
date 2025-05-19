import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl1 = 'http://localhost:3000/auth';
  private apiUrl2 = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(nombreUsuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl1}/login`, { nombreUsuario, password }).pipe(
      tap((response: any) => {
        console.log('Respuesta del login:', response);
        if (response.token) {
          const decodedToken = this.decodeToken(response.token);
          const user = {
            id: decodedToken.id,
            nombreUser: decodedToken.nombreUsuario,
            role: decodedToken.role || 'unknown'
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Almacenado en localStorage:', user);
        } else {
          console.warn('Respuesta inesperada del login:', response);
        }
      }),
      catchError((error) => {
        console.error('Error de login:', error);
        const errorMessage = error.error?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return {};
    }
  }

  register(nombreUsuario: string, password: string, role: 'admin'): Observable<any> {
    return this.http.post(`${this.apiUrl1}/register`, { nombreUsuario, password, role });
  }

  getUsers(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.apiUrl2}/users/getUsers`, { headers });
  }

  getLogs(): Observable<any> {
    return this.http.get(`${this.apiUrl2}/logs`);
  }

  deleteUser(id: string, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl2}/users/deleteUser/${id}`, { headers });
  }

  getUserByUsername(nombreUsuario: string, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.apiUrl2}/users/getUserByUsername/${nombreUsuario}`, { headers });
  }

  updateUser(id: string, nombreUsuario: string, password: string, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const body: { nombreUsuario: string; password?: string } = { nombreUsuario };
    if (password) body.password = password;
    console.log('Petición de actualizar usuario:', { id, body, token }); 
    return this.http.post(`${this.apiUrl2}/users/updateUser/${id}`, body, { headers }).pipe(
      tap((response: any) => {
        console.log('Respuesta de actualizar usuario:', response);
      }),
      catchError((error) => {
        console.error('Error al actualizar usuario:', error);
        const errorMessage = error.error?.message || 'Error al actualizar usuario.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getCurrentUser(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.apiUrl2}/users/me`, { headers });
  }

  createExpense(amount: number, description: string, type: string, token: string): Observable<any> {
    console.log('Create expense request:', { amount, description, type });
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl2}/expenses`, { amount, description, type }, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear petición de gasto:', error);
        return throwError(() => new Error(error.error?.message || 'Error al registrar gasto.'));
      })
    );
  }

  getExpenses(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl2}expenses`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener gastos:', error);
        return throwError(() => new Error(error.error?.message || 'Error al cargar gastos.'));
      })
    );
  }
  }