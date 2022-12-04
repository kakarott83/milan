import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { EmailValidation, PasswordValidation } from '../validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      userEmail: new FormControl('', EmailValidation),
      userPassword: new FormControl('', PasswordValidation),
    });
  }

  ngOnInit(): void {}

  submit() {
    this.router.navigate(['/business/home']);
  }
}
