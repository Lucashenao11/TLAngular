import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Output() cerrarSesionEvent = new EventEmitter<void>();
  @Output() eliminarCuentaEvent = new EventEmitter<void>();
  @Output() actualizarCuentaEvent = new EventEmitter<{ nombreUsuario: string, password: string }>();
  menuVisible = false;

  constructor() {}

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  async cerrarSesion(): Promise<void> {
    this.menuVisible = false;
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Serás redirigido a la página de inicio de sesión.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal2-confirm btn btn-primary',
        cancelButton: 'swal2-cancel btn btn-secondary'
      }
    });

    if (result.isConfirmed) {
      this.cerrarSesionEvent.emit();
    }
  }

  async eliminarCuenta(): Promise<void> {
    this.menuVisible = false;
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal2-confirm btn btn-danger',
        cancelButton: 'swal2-cancel btn btn-secondary'
      }
    });

    if (result.isConfirmed) {
      this.eliminarCuentaEvent.emit();
    }
  }

  async actualizarCuenta(): Promise<void> {
    this.menuVisible = false;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentNombreUsuario = user.nombreUser || '';

    const { value: formValues } = await Swal.fire({
      title: 'Actualizar cuenta',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre de usuario" value="${currentNombreUsuario}" required>` +
        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Nueva contraseña (opcional)">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal2-confirm-actualizar',
        cancelButton: 'swal2-cancel-actualizar'
      },
      preConfirm: () => {
        const nombreUsuario = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const password = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!nombreUsuario) {
          Swal.showValidationMessage('El nombre de usuario es obligatorio');
          return false;
        }
        return { nombreUsuario, password };
      }
    });

    if (formValues) {
      console.log('Emitting actualizarCuentaEvent:', formValues); // Debug log
      this.actualizarCuentaEvent.emit({ nombreUsuario: formValues.nombreUsuario, password: formValues.password });
    }
  }
}