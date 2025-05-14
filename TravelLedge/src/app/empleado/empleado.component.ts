import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Trv-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent {

constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

onAddGasto(tipo: string): void {
  console.log(`Agregar gasto de: ${tipo}`);
}

logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
