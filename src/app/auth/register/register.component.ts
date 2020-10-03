import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user';

import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    //console.log(this.user);
    this.auth.Register(this.user.email, this.user.password)
    this.user.email = '';
    this.user.password = ''
    this.router.navigate([`../login`]);
  }

}
