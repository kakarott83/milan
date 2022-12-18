import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Helpers } from 'src/app/shared/material/Helpers';

import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Spend } from '../../models/spend';
import { Travel } from '../../models/travel';
import { SpendsDialogComponent } from './spendDialog/spends-dialog/spends-dialog.component';

const customer = [
  { id: '4711', city: 'Horgen', name: 'Bank-now', country: {} },
  { id: '4712', city: 'Linz', name: 'Oberbank', country: {} },
  { id: '4713', city: 'Grünwald', name: 'AIL', country: {} },
];

const reason = ['Vor Ort Betreuung', 'Livegang', 'Präsentation'];

export interface DialogData {
  spendType: string;
  spendDate: Date;
  spendValue: number;
}

@Component({
  selector: 'app-create-or-update-travel',
  templateUrl: './create-or-update-travel.component.html',
  styleUrls: ['./create-or-update-travel.component.scss'],
})
export class CreateOrUpdateTravelComponent implements OnInit {
  myTravelForm: FormGroup;
  myTravel!: Travel;
  customerList: Customer[] = customer;
  filteredCustomer!: Observable<Customer[]>;
  city: string = '';
  dataFromDialog: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.myTravel = {};
    this.myTravelForm = this.fb.group({
      start: new FormControl(''),
      startTime: new FormControl(''),
      end: new FormControl(''),
      endTime: new FormControl(''),
      reason: new FormControl(''),
      selectCustomer: new FormControl(''),
      spends: this.fb.array([]),
    });

    this.onChanges();
  }

  get start() {
    return this.myTravelForm.get('start')?.value;
  }

  get startTime() {
    return this.myTravelForm.get('startTime')?.value;
  }

  get end() {
    return this.myTravelForm.get('end')?.value;
  }

  get endTime() {
    return this.myTravelForm.get('endTime')?.value;
  }

  get reason() {
    return this.myTravelForm.get('reason')?.value;
  }

  get selectCustomer() {
    return this.myTravelForm.get('selectCustomer')?.value;
  }

  get spends() {
    return this.myTravelForm.get('spends') as FormArray;
  }

  get isValid() {
    return this.myTravelForm.valid;
  }

  ngOnInit(): void {}

  submitTravel(event: any) {
    console.log(event);
  }

  onChanges() {
    this.myTravelForm.valueChanges.subscribe((val) => {
      console.log(val);
      console.log(this.startTime, 'Changes');
      this.setValue();
    });
  }

  newSpend(dates: any): FormGroup {
    return this.fb.group({
      date: [dates.date],
      value: [dates.value],
      type: [dates.type],
      text: [dates.text],
    });
  }

  updateTime(event: any, type: string) {}

  displayFn(customer: Customer): string {
    return customer && customer.name ? customer.name : '';
  }

  addSpend(dates: any) {
    this.spends.push(this.newSpend(dates));
  }

  removeSpend(i: number) {
    this.spends.removeAt(i);
  }

  setValue() {
    let start = new Date();
    let end = new Date();

    let s = new Date(moment(this.start).format('YYYY-MM-DD'));
    let e = new Date(moment(this.end).format('YYYY-MM-DD'));

    if (this.startTime !== '') {
      let sSplit = Helpers.splitTime(this.startTime);
      if (sSplit !== undefined && sSplit.length > 0) {
        s.setHours(Number(sSplit[0]));
        s.setMinutes(Number(sSplit[1]));
      }
    }

    if (this.endTime !== '') {
      let eSplit = Helpers.splitTime(this.endTime);
      if (eSplit !== undefined && eSplit.length > 0) {
        e.setHours(Number(eSplit[0]));
        e.setMinutes(Number(eSplit[1]));
      }
    }

    if (s instanceof Date) {
      start = s;
    }

    if (e instanceof Date) {
      end = e;
    }

    if (this.selectCustomer !== '') {
      this.city = this.selectCustomer.city;

      console.log(this.selectCustomer.city, 'Select');
    }

    if (this.isValid) {
      console.log(this.isValid);
      /*this.myTravel = {
        start: start.toISOString(),
        end: end.toISOString(),
        customer: this.selectCustomer,
      };*/
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SpendsDialogComponent, {
      width: '600px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.dataFromDialog = data.form;
      if (data.clicked === 'submit') {
        this.addSpend(this.dataFromDialog);
        console.log(this.dataFromDialog, 'Dialog');
        console.log(this.spends, 'Spends');
      }
    });
  }
}
