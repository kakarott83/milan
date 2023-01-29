import * as auth from 'firebase/auth';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from '@firebase/util';

import { AppUser } from '../../models/appUser';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements AfterViewInit {
  userForm: FormGroup;
  myUser: AppUser;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private dataService: DataServiceService
  ) {
    const uid = this.authService.userData.uid;

    this.dataService
      .getAppUserByUid(uid)
      .snapshotChanges()
      .subscribe((user) => {
        this.myUser = user.payload.toJSON();
        console.log(this.myUser, 'From Service');
      });

    this.myUser = this.authService.userData;
    this.createUserForm(this.myUser);
  }

  ngAfterViewInit() {}

  createUserForm(user) {
    this.userForm = this.fb.group({
      userName: new FormControl(''),
      userId: new FormControl(user.uid),
      signSince: new FormControl({ value: '', disabled: true }),
      //userEmail: new FormControl({ value: '', disabled: true }),
      userEmail: new FormControl(user.email),
    });
  }

  submit(event: Event) {
    console.log(this.userForm);
  }
}
