import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'Trv-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  empleadosCount: number = 0;
  recentLogs: any[] = []; // Array para almacenar los logs
  empleados: any[] = [];

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getEmpleadosCount();
    this.getRecentLogs();
  }

  // Obtener la cantidad de empleados
  getEmpleadosCount(): void {
    const token = localStorage.getItem('token');

    if (!token){
      this.router.navigate(['/login']);
    } else {
      this.authService.getUsers(token).subscribe(
      (response) => {
        this.empleadosCount = response.length;  // Número de empleados
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
    }
  }

  // Obtener los logs más recientes
  getRecentLogs(): void {

    this.authService.getLogs().subscribe(
      (response) => {
        this.recentLogs = response;
      },
      (error) => {
        console.error('Error al obtener logs:', error);
      }
    );
  }
  
  onAddEmployee(): void {
    this.router.navigate(['add-employee'], { relativeTo: this.route });
  }

  onViewEmployee(): void {
    this.router.navigate(['view-employee'], { relativeTo: this.route });
  }

  onManageEmployee(): void {
    this.router.navigate(['manage-employee'], {relativeTo: this.route});
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  eliminarCuenta() {
throw new Error('Method not implemented.');
}
}
