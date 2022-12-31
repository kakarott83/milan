import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Helpers } from 'src/app/shared/material/Helpers';

import { isNgTemplate } from '@angular/compiler';
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
  total = 0;
  userId = '';

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
    this.createUser();
  }

  submitTravel(event: any) {
    this.createMyTravel();
    console.log(this.myTravel, 'MyTravel');
  }

  createMyTravel() {
    this.myTravel = {
      start: Helpers.dateTime(this.start as Date, this.startTime).toString(),
      end: Helpers.dateTime(this.end as Date, this.endTime).toString(),
      spend: this.mySpends,
      customer: this.selectCustomer,
      rate: this.rate,
      spendValue: this.spendValue,
      total: this.total,
      userId: localStorage.getItem('userId')?.toString(),
    };
  }

  createUser() {
    let r = (Math.random() + 1).toString(36).substring(7);
    localStorage.setItem('userId', r);
    this.userId = r;
  }

  onChanges() {
    this.myTravelForm.valueChanges.subscribe((val) => {
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
    //Ort des Kunden setzen
    if (this.selectCustomer) {
      this.city = this.selectCity;
    }

    //Ausgaben summieren
    this.mySpends = this.spends.value;
    let v = 0;
    this.mySpends.forEach(
      (x) => (v += x.value !== undefined ? Number(x.value) : 0)
    );
    this.spendValue = v;

    //Zeiten berechnen und Erstattung summieren
    if (
      this.start !== '' &&
      this.end !== '' &&
      this.startTime !== '' &&
      this.endTime !== ''
    ) {
      let s = Helpers.dateTime(this.start as Date, this.startTime);
      let e = Helpers.dateTime(this.end as Date, this.endTime);
      let diff = Helpers.calcDiffinMinutes(s, e);

      let catering = {
        breakfast: this.breakfast,
        launch: this.launch,
        dinner: this.dinner,
      };

      this.rate = isNaN(Helpers.calcRate(diff, this.selectCustomer, catering))
        ? 0
        : Helpers.calcRate(diff, this.selectCustomer, catering);

      this.total = this.rate + this.spendValue;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SpendsDialogComponent, {
      width: '600px',
      height: '600px',
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
