import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent {
manejarActualizacion(actualizado: any) {
  Swal.fire({
    icon: 'success',
    title: 'Empleado actualizado',
    text: `El empleado ${actualizado.nombre} fue actualizado correctamente.`,
    confirmButtonText: 'Aceptar'
  });

  this.empleadoSeleccionado = null;
  this.nombreBuscado = '';
  this.mostrarFormulario = false; // Ocultar el formulario
}


  nombreBuscado: string = '';
  empleadoSeleccionado: any = null;
  error: string = '';
  mostrarFormulario: boolean = false;

  constructor(private authService: AuthService) {}

  buscarEmpleado(): void {
  const token = localStorage.getItem('token');

  // Validaciones básicas
  if (!token) {
    this.error = 'Token no disponible. Por favor, inicia sesión.';
    return;
  }

  if (!this.nombreBuscado.trim()) {
    this.error = 'Por favor, ingresa un nombre de usuario.';
    return;
  }

  // Reiniciar estado previo
  this.error = '';
  this.empleadoSeleccionado = null;

  this.authService.getUserByUsername(this.nombreBuscado.trim(), token).subscribe({
    next: (user) => {
      if (user) {
        this.empleadoSeleccionado = user;
      } else {
        this.error = 'Empleado no encontrado.';
      }
    },
    error: (err) => {
      console.error('Error al buscar empleado:', err);
      this.error = 'Error al buscar el empleado. Intenta nuevamente.';
      }
    });
  }
} 
