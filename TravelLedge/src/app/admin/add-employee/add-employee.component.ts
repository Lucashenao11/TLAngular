import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'Trv-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
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
          alert('¡Empleado registrado con éxito!')
        },
        error: (err) => {
          console.error('Error al crear empleado:', err);
          alert(`Error: ${err.error?.error || 'Credenciales inválidas o error del servidor'}`);
        }
      });
      }
    }
}
