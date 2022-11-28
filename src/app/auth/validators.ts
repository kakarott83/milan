import {
	AbstractControl,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export const NameValidation = [Validators.required, Validators.minLength(4)];
export const EmailValidation = [Validators.required, Validators.email];
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(20),
];

export class RepeatPasswordEStateMatch implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control &&
      control.parent?.get('userPassword')?.value !==
        control.parent?.get('userPasswordConfirm')?.value &&
      control.dirty === true
      ? true
      : false;
  }
}

export function RepeatPasswordValidator(group: FormGroup) {
  const password = group.controls['userPassword'].value;
  const passwordConfirm = group.controls['userPasswordConfirm'].value;

  return password === passwordConfirm ? null : { passwordsNotEqual: true };
}
