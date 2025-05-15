import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css']
})
export class DeleteEmployeeComponent {
  @Input() empleado: any;
  @Output() onDeleted = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  eliminar(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el empleado "${this.empleado.nombreUser}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(this.empleado.id, token).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Empleado eliminado',
              text: `El empleado "${this.empleado.nombreUser}" fue eliminado exitosamente.`,
              confirmButtonText: 'OK'
            });
            this.onDeleted.emit();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el empleado.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }
}
