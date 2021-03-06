import { NgModule } from '@angular/core';
import { flush } from '@angular/core/testing';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component'
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartComponent } from './start/start.component';

import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: 'start', component: StartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'dashboard', component: DashboardComponent , canActivate:[AuthGuardService]},
  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {path: '**', component: StartComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
