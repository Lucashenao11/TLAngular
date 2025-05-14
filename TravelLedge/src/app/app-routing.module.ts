import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { RegistroComponent } from './registro/registro.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './admin/view-employee/view-employee.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'view-employee', component: ViewEmployeeComponent }
    ] },
  { path: 'empleado',
    component: EmpleadoComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'empleado' } },
  { path: 'registro', component: RegistroComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
