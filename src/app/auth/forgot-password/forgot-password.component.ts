import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmailValidation } from '../validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPwForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.forgotPwForm = this.fb.group({
      email: new FormControl('', EmailValidation),
    });
  }

  submit() {}
}
