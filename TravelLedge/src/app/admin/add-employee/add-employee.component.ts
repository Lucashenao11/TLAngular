import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
      role: ['empleado']
    });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      const { nombreUsuario, password, role } = this.addEmployeeForm.value;

      this.authService.register(nombreUsuario, password, role).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          Swal.fire({
            icon: 'success',
            title: '¡Empleado registrado!',
            text: 'El nuevo empleado ha sido creado exitosamente.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.addEmployeeForm.reset();
          });
        },
        error: (err) => {
          console.error('Error al crear empleado:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: err.error?.error || 'Credenciales inválidas o error del servidor',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos antes de continuar.',
        confirmButtonColor: '#f6c343'
      });
    }
  }
}
