import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeeComponent } from './empleado/empleado.component';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';

import { HttpClientModule } from '@angular/common/http';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './admin/view-employee/view-employee.component';
import { ManageEmployeeComponent } from './admin/manage-employee/manage-employee.component';
import { DeleteEmployeeComponent } from './admin/manage-employee/delete-employee/delete-employee.component';
import { UpdateEmployeeComponent } from './admin/manage-employee/update-employee/update-employee.component';
import { SettingsComponent } from './admin/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    EmployeeComponent,
    RegistroComponent,
    AddEmployeeComponent,
    ViewEmployeeComponent,
    ManageEmployeeComponent,
    DeleteEmployeeComponent,
    UpdateEmployeeComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
