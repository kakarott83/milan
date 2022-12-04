import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  userForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userName: new FormControl(''),
      userId: new FormControl(''),
      signSince: new FormControl({ value: '', disabled: true }),
      //userEmail: new FormControl({ value: '', disabled: true }),
      userEmail: new FormControl(''),
    });
  }

  submit(event: Event) {
    console.log(this.userForm);
  }
}
