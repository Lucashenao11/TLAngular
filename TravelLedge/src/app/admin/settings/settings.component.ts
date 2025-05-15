import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  menuVisible = false;

  @Output() cerrarSesionEvent = new EventEmitter<void>();
  @Output() eliminarCuentaEvent = new EventEmitter<void>();

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  // Esto detecta clics en todo el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.settings-container');
    if (!clickedInside) {
      this.menuVisible = false;
    }
  }

  async cerrarSesion() {
    this.menuVisible = false;

    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.cerrarSesionEvent.emit();
      Swal.fire('Sesión cerrada', '', 'success');
    }
  }

  async eliminarCuenta() {
    this.menuVisible = false;

    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.eliminarCuentaEvent.emit();
      Swal.fire('Cuenta eliminada', '', 'success');
    }
  }
}
