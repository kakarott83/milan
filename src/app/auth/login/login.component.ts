import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user';

import { AuthenticationService } from 'src/app/services/authentication.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  loginForm;
  error;
  isLoading = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService

  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    //console.log(this.user);
    /*
    this.auth.Login(this.user.email, this.user.password)
    this.user.email = '';
    this.user.password = ''
    this.router.navigate([`../dashboard`])
    */
   this.auth.logInUser(this.user.email, this.user.password)
    .then(resp => {
      console.log(resp.user);
      this.isLoading = false;
      this.auth.setLoginStatus(true);
      this.router.navigate([`/dashboard`])
    })
    .catch(error => {
      this.error = error;
      this.isLoading = false;
    });
    
  }

}
