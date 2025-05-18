import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { nombreUsuario, password } = this.loginForm.value;

      this.authService.login(nombreUsuario, password).subscribe({
        next: (res) => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const role = user.role;

          console.log('User from localStorage:', user);

          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'empleado') {
            this.router.navigate(['/empleado']);
          } else {
            this.router.navigate(['/']);
            Swal.fire({
              title: 'Error',
              text: 'Rol no reconocido.',
              icon: 'error',
              customClass: {
                confirmButton: 'swal2-confirm btn btn-danger'
              },
              buttonsStyling: false
            });
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          Swal.fire({
            title: 'Error',
            text: err.message || 'Credenciales inválidas o error del servidor.',
            icon: 'error',
            customClass: {
              confirmButton: 'swal2-confirm btn btn-danger'
            },
            buttonsStyling: false
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos.',
        icon: 'warning',
        customClass: {
          confirmButton: 'swal2-confirm btn btn-danger'
        },
        buttonsStyling: false
      });
    }
  }
}