import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {
  @Input() empleado: any;
  @Output() onUpdated = new EventEmitter<any>();
  
  nuevoNombre: string = '';
  nuevoPassword: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
  }

  actualizar(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Token no disponible',
      text: 'Por favor, inicia sesión para continuar.',
    });
    return;
  }

  this.authService.updateUser(
    this.empleado.id,
    this.nuevoNombre,
    this.nuevoPassword,
    token
  ).subscribe({
    next: (res) => {
      this.onUpdated.emit(res);
      this.error = '';

      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: `El empleado fue actualizado correctamente.`,
        confirmButtonText: 'Aceptar'
      });

      // Limpiar campos después de actualizar
      this.nuevoNombre = '';
      this.nuevoPassword = '';
    },
    error: () => {
      this.error = 'Error al actualizar';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al actualizar el empleado.',
        });
      }
    });
  }
}
