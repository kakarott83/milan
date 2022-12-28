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
  {
    id: '4711',
    city: 'Horgen',
    name: 'Bank-now',
    country: { name: 'Schweiz', rate: 64, halfRate: 32 },
  },
  {
    id: '4712',
    city: 'Linz',
    name: 'Oberbank',
    country: { name: 'Österreich', rate: 24, halfRate: 12 },
  },
  {
    id: '4713',
    city: 'Grünwald',
    name: 'AIL',
    country: { name: 'Deutschland', rate: 24, halfRate: 12 },
  },
];

const reasons = ['Vor Ort Betreuung', 'Livegang', 'Präsentation'];

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
  mySpends: Spend[] = [{}];
  customerList: Customer[] = customer;
  filteredCustomer!: Observable<Customer[]>;
  city: string = '';
  dataFromDialog: any;
  reasons = reasons;
  durDays: any;
  durHours: any;
  rate = 0;
  spendValue = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.myTravel = {};
    this.myTravelForm = this.fb.group({
      start: new FormControl<Date>(new Date()),
      startTime: new FormControl(''),
      end: new FormControl(''),
      endTime: new FormControl(''),
      reason: new FormControl(''),
      selectCustomer: new FormControl(''),
      spends: this.fb.array([]),
      breakfast: new FormControl(true),
      launch: new FormControl(false),
      dinner: new FormControl(false),
    });

    this.onChanges();
  }

  get start() {
    return this.myTravelForm.get('start')?.value;
  }

  get startTime(): string {
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

  get selectCity() {
    return this.selectCustomer.city;
  }

  get spends() {
    return this.myTravelForm.get('spends') as FormArray;
  }

  get breakfast() {
    return this.myTravelForm.get('breakfast')?.value;
  }

  get launch() {
    return this.myTravelForm.get('launch')?.value;
  }

  get dinner() {
    return this.myTravelForm.get('dinner')?.value;
  }

  get isValid() {
    return this.myTravelForm.valid;
  }

  ngOnInit(): void {
    console.log(this.myTravelForm.value, 'Init');
    if (
      this.start !== '' &&
      this.end !== '' &&
      this.startTime !== '' &&
      this.endTime !== ''
    ) {
      console.log('Empty');
    }
  }

  submitTravel(event: any) {}

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
    if (this.selectCustomer) {
      this.city = this.selectCity;
    }

    /*ToDo Summieren*/
    this.mySpends = this.spends.value;
    let v = 0;
    this.mySpends.forEach((x) => (v += x.value !== undefined ? x.value : 0));
    this.spendValue = v;

    if (
      this.start !== '' &&
      this.end !== '' &&
      this.startTime !== '' &&
      this.endTime !== ''
    ) {
      let s = this.start as Date;
      let e = this.end as Date;
      let tStartSplit = this.startTime.split(':');
      let tEndSplit = this.endTime.split(':');
      s.setHours(Number(tStartSplit[0]), Number(tStartSplit[1]), 0);
      e.setHours(Number(tEndSplit[0]), Number(tEndSplit[1]), 0);

      let mStart = moment(s, 'DD-MM-YYYY hh:mm');
      let mEnd = moment(e, 'DD-MM-YYYY hh:mm');

      let diff = mEnd.diff(mStart, 'minutes');
      this.durDays = Math.floor(diff / 1440);
      this.durHours = Math.floor((diff % 1440) / 60);

      let catering = {
        breakfast: this.breakfast,
        launch: this.launch,
        dinner: this.dinner,
      };

      this.rate = isNaN(Helpers.calcRate(diff, this.selectCustomer, catering))
        ? 0
        : Helpers.calcRate(diff, this.selectCustomer, catering);
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
