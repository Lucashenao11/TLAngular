import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'Trv-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;

constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
  nombreUsuario: ['', Validators.required],
  password: ['', Validators.required],
  role: ['admin'] 
});

  }

  onSubmit(): void {
  if (this.registroForm.valid) {
    const { nombreUsuario, password, role } = this.registroForm.value;

    this.authService.register(nombreUsuario, password, role).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

          this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al registrarse:', err);  // Mostrar el error en la consola
        alert(`Error: ${err.error?.error || 'Credenciales inválidas o error del servidor'}`);
      }
    });
    }
  }
}
