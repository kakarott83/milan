import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { sign } from 'crypto';
import * as firebase from 'firebase';
import { error } from 'protractor';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: Observable<firebase.User>;
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || ('false'))

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
  /*Login(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log('erfolgreich eingeloggt', resp)
        console.log(resp.user.uid)
      })
      .catch(error => {
        console.log('Fehler beim Login')
      })
  }
  */
 logInUser(email: string, password: string) {
   return firebase.auth()
   .signInWithEmailAndPassword(email, password)
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

  /*setLogInStatus*/
  setLoginStatus(value) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true')
  }

  get LoginStatus() {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }

  /* LogOut */
  Logout() {
    this.angularFireAuth.signOut();
  }
}
