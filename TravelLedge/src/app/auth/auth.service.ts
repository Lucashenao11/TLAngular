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
        console.log('Login response:', response);
        if (response.token) {
          const decodedToken = this.decodeToken(response.token);
          const user = {
            id: decodedToken.id,
            nombreUser: decodedToken.nombreUsuario,
            role: decodedToken.role || 'unknown'
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Stored user in localStorage:', user);
        } else {
          console.warn('Unexpected login response format:', response);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
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
      console.error('Error decoding token:', error);
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
    console.log('Update user request:', { id, body, token }); // Debug log
    return this.http.post(`${this.apiUrl2}/users/updateUser/${id}`, body, { headers }).pipe(
      tap((response: any) => {
        console.log('Update user response:', response);
      }),
      catchError((error) => {
        console.error('Update user error:', error);
        const errorMessage = error.error?.message || 'Error al actualizar usuario.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getCurrentUser(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.apiUrl2}/users/me`, { headers });
  }
}