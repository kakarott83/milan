import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/service/auth.service';
import { EmailValidation, PasswordValidation } from '../validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userEmail: new FormControl('', EmailValidation),
      userPassword: new FormControl('', PasswordValidation),
    });
  }

  get userEmail() {
    return this.loginForm.get('userEmail').value;
  }

  get userPassword() {
    return this.loginForm.get('userPassword').value;
  }

  ngOnInit(): void {}

  submit() {
    this.authService.login(this.userEmail, this.userPassword);
  }
}
