import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';

import { EmailValidation, PasswordValidation } from '../validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userEmail: new FormControl('', EmailValidation),
      userPassword: new FormControl('', PasswordValidation),
    });
  }

  ngOnInit(): void {}

  submit() {}
}
