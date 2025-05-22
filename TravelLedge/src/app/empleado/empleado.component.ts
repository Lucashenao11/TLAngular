import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'Trv-employee',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmployeeComponent implements OnInit {
  expenseForm!: FormGroup;
  expenses: any[] = [];
  userNombreUser: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userNombreUser = user.nombreUser || '';
    if (!this.userNombreUser || user.role !== 'empleado') {
      this.router.navigate(['/login']);
      return;
    }

    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['transporte', Validators.required]
    });

    this.loadExpenses();
  }

  loadExpenses(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getExpenses(token).subscribe({
      next: (data) => {
        console.log('Expenses loaded:', data);
        this.expenses = data;
      },
      error: (error) => {
        console.error('Error al cargar gastos:', JSON.stringify(error, null, 2));
        const errorMessage = error.status === 401
          ? 'Sesión expirada, por favor inicia sesión de nuevo.'
          : error.error?.message || 'No se pudieron cargar los gastos.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          customClass: { confirmButton: 'swal2-confirm btn btn-danger' },
          buttonsStyling: false
        });
        if (error.status === 401) {
          this.logout();
        }
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const { amount, description, type } = this.expenseForm.value;
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      console.log('Submitting expense:', { amount, description, type, token });
      this.authService.createExpense(amount, description, type, token).subscribe({
        next: (response) => {
          this.expenses.unshift(response.expense);
          this.expenseForm.reset({ type: 'transporte' });
          Swal.fire({
            title: 'Éxito',
            text: response.message || 'Gasto registrado correctamente.',
            icon: 'success',
            customClass: { confirmButton: 'swal2-confirm btn btn-primary' },
            buttonsStyling: false
          });
        },
        error: (error) => {
          console.error('Error al registrar gasto:', error);
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'No se pudo registrar el gasto.',
            icon: 'error',
            customClass: { confirmButton: 'swal2-confirm btn btn-danger' },
            buttonsStyling: false
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'warning',
        customClass: { confirmButton: 'swal2-confirm btn btn-danger' },
        buttonsStyling: false
      });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'success',
      customClass: { confirmButton: 'swal2-confirm btn btn-primary' },
      buttonsStyling: false
    });
  }
}