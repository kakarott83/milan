import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth/auth.module'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { StartComponent } from './start/start.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component'

import { AngularFireModule } from '@angular/fire';

export const firebaseConfig = {
  apiKey: "AIzaSyBc6HeQrS-FYiBzL1FW4yA2wS7J_QkqptY",
  authDomain: "mywebsite-2516c.firebaseapp.com",
  databaseURL: "https://mywebsite-2516c.firebaseio.com",
  projectId: "mywebsite-2516c",
  storageBucket: "mywebsite-2516c.appspot.com",
  messagingSenderId: "1046415308706",
  appId: "1:1046415308706:web:1eba2198146320a6a4a4fb",
  measurementId: "G-YGE7NPD7FH"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    StartComponent,
    RegisterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
