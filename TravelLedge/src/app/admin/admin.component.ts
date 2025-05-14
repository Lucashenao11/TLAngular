import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Trv-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onAddEmployee(): void {
    this.router.navigate(['add-employee'], { relativeTo: this.route });
  }

  onViewEmployee(): void {
    this.router.navigate(['view-employee'], { relativeTo: this.route });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
