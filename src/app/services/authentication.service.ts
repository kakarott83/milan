import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { error } from 'protractor';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: Observable<firebase.User>;
  constructor(
    private angularFireAuth: AngularFireAuth
  ) { 
    this.userData = angularFireAuth.authState;
  }

  /*Sign up*/
  Register(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then(resp=>{
        console.log('erfolgreich Registriert',resp);
      })
      .catch(error => {
        console.log('Fehler beim registrieren',error.message);
      });
  }

  /*Login*/
  Login(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log('erfolgreich eingeloggt')
      })
      .catch(error => {
        console.log('Fehler beim Login')
      })
  }

  /*Reset Password*/
  ResetPassword(email: string) {
    this.angularFireAuth.sendPasswordResetEmail(email)
      .then(resp => {
        console.log('Passwort zurückgesetzt');
      })
      .catch(error => {
        console.log('Fehler beim Passwort zurücksetzen')
      })
  }

  /* LogOut */
  Logout() {
    this.angularFireAuth.signOut();
  }
}
