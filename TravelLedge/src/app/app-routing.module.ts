import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeeComponent } from './empleado/empleado.component';
import { RegistroComponent } from './registro/registro.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './admin/view-employee/view-employee.component';
import { AuthGuard } from './guards/auth.guard';
import { ManageEmployeeComponent } from './admin/manage-employee/manage-employee.component';
import { DeleteEmployeeComponent } from './admin/manage-employee/delete-employee/delete-employee.component';
import { UpdateEmployeeComponent } from './admin/manage-employee/update-employee/update-employee.component';
import { SettingsComponent } from './admin/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'manage-employee', 
        component: ManageEmployeeComponent,
      children: [
        {path: 'delete-employee', component: DeleteEmployeeComponent },
        {path: 'update-employee', component: UpdateEmployeeComponent }
      ]},
      { path: 'view-employee', component: ViewEmployeeComponent },
      { path: 'settings', component: SettingsComponent }
    ] },
  { path: 'empleado',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'empleado' } },
  { path: 'registro', component: RegistroComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
