import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'Trv-view-employees',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  empleados: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.authService.getUsers(token).subscribe(
        (data) => {
          this.empleados = data; // Guardamos los usuarios
        },
        (error) => {
          console.error('Error al obtener los usuarios:', error);
        }
      );
    }
  }
}
