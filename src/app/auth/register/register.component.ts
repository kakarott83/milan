import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {}

  submit() {}
}
