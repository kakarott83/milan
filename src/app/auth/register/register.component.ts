import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/service/auth.service';
import {
	EmailValidation,
	NameValidation,
	PasswordValidation,
	RepeatPasswordEStateMatch,
	RepeatPasswordValidator,
} from '../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordMatcher = new RepeatPasswordEStateMatch();

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        userName: new FormControl('', NameValidation),
        userEmail: new FormControl('', EmailValidation),
        userPassword: new FormControl('', PasswordValidation),
        userPasswordConfirm: new FormControl(''),
      },
      { validator: RepeatPasswordValidator }
    );
  }

  get userEmail() {
    return this.registerForm.get('userEmail').value;
  }

  get userPassword() {
    return this.registerForm.get('userPassword').value;
  }

  get userName() {
    return this.registerForm.get('userName').value;
  }

  ngOnInit(): void {}

  register() {
    this.authService.register(this.userEmail, this.userPassword, this.userName);
  }

  submit() {}
}
