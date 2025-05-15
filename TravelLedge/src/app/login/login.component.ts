import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
        localStorage.setItem('token', res.token);

        const decodedToken = this.decodeToken(res.token);  // Usa una función para decodificar el token
        localStorage.setItem('id', decodedToken.id);  // 👈 Agrega esta línea

        // Redireccionar basado en el rol
        if (decodedToken.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (decodedToken.role === 'empleado') {
          this.router.navigate(['/empleado']);
        } else {
          this.router.navigate(['/']);  // Si el rol no es reconocido, redirige a Home
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);  // Mostrar el error en la consola
        alert(`Error: ${err.error?.error || 'Credenciales inválidas o error del servidor'}`);
      }
    });
  }
}

// Función para decodificar el token
decodeToken(token: string) {
  const payload = token.split('.')[1]; // Obtenemos la parte del payload
  return JSON.parse(atob(payload));  // Decodificamos el payload y lo retornamos
  }
}