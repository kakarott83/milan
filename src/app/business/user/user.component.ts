import * as auth from 'firebase/auth';
import * as moment from 'moment';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from '@firebase/util';

import { AppUser } from '../../models/appUser';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DatePipe],
})
export class UserComponent implements AfterViewInit {
  userForm: FormGroup;
  myUser: AppUser;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private dataService: DataServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    const uid = this.authService.userData.uid;
    this.createUserForm();
    this.dataService
      .getAppUserByUid(uid)
      .snapshotChanges()
      .subscribe((user) => {
        this.myUser = user.payload.toJSON();
        console.log(this.myUser, 'Sub');
        this.updateUserForm();
        this.changeDetectorRef.detectChanges();
      });
  }

  get userId() {
    return this.userForm.get('userId').value;
  }

  get userEmail() {
    return this.userForm.get('userEmail').value;
  }

  get signSince() {
    return this.myUser.createdAt;
  }

  get userName() {
    return this.userForm.get('userName').value;
  }

  ngAfterViewInit() {}

  createUserForm() {
    this.userForm = this.fb.group({
      userName: new FormControl(''),
      userId: new FormControl({ value: '', disabled: true }),
      signSince: new FormControl({ value: '', disabled: true }),
      userEmail: new FormControl({ value: '', disabled: true }),
    });
  }

  updateUserForm() {
    this.userForm.patchValue({
      userName: this.myUser.name,
      userId: this.myUser.uid,
      signSince: this.datePipe.transform(
        new Date(Number(this.myUser.createdAt)),
        'dd.MM.yyyy'
      ),
      userEmail: this.myUser.email,
    });
  }

  submit(event: Event) {
    this.createMyUser();
    console.log(this.myUser);
    this.dataService.createOrUpdateAppUser(this.myUser);
  }

  createMyUser() {
    this.myUser = {
      id: this.userId,
      name: this.userName,
      uid: this.userId,
      email: this.userEmail,
      createdAt: this.signSince,
    };
  }
}
