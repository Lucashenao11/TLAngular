import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  empleadosCount: number = 0;
  recentLogs: any[] = [];
  empleados: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getEmpleadosCount();
    this.getRecentLogs();
  }

  getEmpleadosCount(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.authService.getUsers(token).subscribe(
        (response) => {
          this.empleadosCount = response.length;
        },
        (error) => {
          console.error('Error al obtener empleados:', error);
        }
      );
    }
  }

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
    this.router.navigate(['manage-employee'], { relativeTo: this.route });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'success',
      customClass: {
        confirmButton: 'swal2-confirm btn btn-primary'
      },
      buttonsStyling: false
    });
  }

  eliminarCuenta(): void {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    console.log('Eliminar cuenta - token:', token, 'userId:', userId);

    if (!token || !userId) {
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'Error',
        text: 'Sesión no válida. Por favor, inicia sesión de nuevo.',
        icon: 'error',
        customClass: {
          confirmButton: 'swal2-confirm btn btn-danger'
        },
        buttonsStyling: false
      });
      return;
    }

    this.authService.deleteUser(userId, token).subscribe(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'Cuenta eliminada',
          text: 'Tu cuenta ha sido eliminada exitosamente.',
          icon: 'success',
          customClass: {
            confirmButton: 'swal2-confirm btn btn-primary'
          },
          buttonsStyling: false
        });
      },
      (error) => {
        console.error('Error al eliminar cuenta:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.',
          icon: 'error',
          customClass: {
            confirmButton: 'swal2-confirm btn btn-danger'
          },
          buttonsStyling: false
        });
      }
    );
  }

  actualizarCuenta(data: { nombreUsuario: string, password: string }): void {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    console.log('Actualizar cuenta - token:', token, 'userId:', userId, 'data:', data);

    if (!token || !userId) {
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'Error',
        text: 'Sesión no válida. Por favor, inicia sesión de nuevo.',
        icon: 'error',
        customClass: {
          confirmButton: 'swal2-confirm btn btn-danger'
        },
        buttonsStyling: false
      });
      return;
    }

    this.authService.updateUser(userId, data.nombreUsuario, data.password, token).subscribe(
      (response) => {
        if (response.message === 'No se proporcionaron cambios.') {
          Swal.fire({
            title: 'Sin cambios',
            text: response.message,
            icon: 'info',
            customClass: {
              confirmButton: 'swal2-confirm btn btn-primary'
            },
            buttonsStyling: false
          });
          return;
        }
        const updatedNombreUser = response.usuario?.nombreUser || data.nombreUsuario;
        localStorage.setItem('user', JSON.stringify({ id: userId, nombreUser: updatedNombreUser, role: user.role }));
        Swal.fire({
          title: 'Éxito',
          text: response.message || 'Cuenta actualizada correctamente.',
          icon: 'success',
          customClass: {
            confirmButton: 'swal2-confirm btn btn-primary'
          },
          buttonsStyling: false
        });
      },
      (error) => {
        console.error('Error al actualizar cuenta:', error);
        const errorMessage = error.error?.message || 'No se pudo actualizar la cuenta.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          customClass: {
            confirmButton: 'swal2-confirm btn btn-danger'
          },
          buttonsStyling: false
        });
      }
    );
  }
}