import { NgModule } from '@angular/core';
import { flush } from '@angular/core/testing';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component'
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { StartComponent } from './start/start.component';


const routes: Routes = [
  {path: 'start', component: StartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {path: '**', component: StartComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
