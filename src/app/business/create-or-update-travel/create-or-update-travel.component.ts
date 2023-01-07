import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Helpers } from 'src/app/shared/material/Helpers';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Catering } from '../../models/catering';
import { Spend } from '../../models/spend';
import { Travel } from '../../models/travel';
import { SpendsDialogComponent } from './spendDialog/spends-dialog/spends-dialog.component';

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
  customerList: Customer[] = [];
  myCatering: Catering;
  filteredCustomer!: Observable<Customer[]>;
  city: string = '';
  dataFromDialog: any;
  reasons = reasons;
  reasonValue: string;
  customerName: string;
  durDays: any;
  durHours: any;
  rate = 0;
  spendValue = 0;
  total = 0;
  userId = 'ea5eg'; // localStorage.getItem('userId');
  myDatePipe!: any;
  startDate;
  endDate;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataServiceService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute
  ) {
    this.getCustomer();
    this.createTravelForm();
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id != null) {
      console.log(id);
      this.dataService
        .getTravelById(id)
        .snapshotChanges()
        .subscribe((data) => {
          this.myTravel = data.payload.toJSON();
          this.startDate = new Date(this.myTravel.start);
          this.endDate = new Date(this.myTravel.end);
          this.city = this.myTravel.customer.city;
          this.reasonValue = this.myTravel.reason;
          console.log(typeof this.myTravel.spend);

          //Array befüllen
          if (this.myTravel.spend !== undefined) {
            let v = this.myTravel.spend;
            let s = [];
            Object.keys(v).map(function (key) {
              s.push({ [key]: v[key] });
              return s;
            });

            for (let index = 0; index < s.length; index++) {
              let element: Spend = s[index][index];
              this.addSpend(element);
            }
          }

          this.myTravelForm.patchValue({
            startTime: this.formatTime(new Date(this.myTravel.start)),
            endTime: this.formatTime(new Date(this.myTravel.end)),
            breakfast: this.myTravel.catering.breakfast,
            launch: this.myTravel.catering.launch,
            dinner: this.myTravel.catering.dinner,
            total: this.myTravel.total,
            spendValue: this.myTravel.spendValue,
            rate: this.myTravel.rate,
          });

          const toSelectCustomer = this.myTravel.customer;
          this.myTravelForm.get('selectCustomer').setValue(toSelectCustomer);

          const toSelectReason = this.myTravel.reason;
          this.myTravelForm.get('reason').setValue(toSelectReason);

          console.log(this.myTravelForm.value);
        });
    }

    this.myDatePipe = datePipe;

    this.onChanges();
  }

  //ToDo in Helpers
  formatDate(date: Date) {
    const d = date;
    let month = +(d.getMonth() + 1);
    let day = +d.getDate();
    let year = d.getFullYear();
    return [year, month, day].join('-');
  }

  formatTime(date: Date) {
    const t = date;
    let hour = date.getHours();
    let minute = date.getMinutes();
    return [hour, minute].join(':');
  }

  createSpend(spend): FormGroup {
    return this.fb.group({
      date: [spend.date],
      value: [spend.value],
      type: [spend.type],
      text: [spend.text],
    });
  }

  isSameCustomer(cust1: Customer, cust2: Customer): boolean {
    // vergleicht die Länderliste
    // console.log(cust1.name + ' ' + cust2.name, 'Comp');
    return !!cust1 && cust1.name === cust2.name;
  }

  isSameReason(reason1: string, reason2: string): boolean {
    // vergleicht die Länderliste
    console.log(reason1 + ' ' + reason1, 'Comp');
    return !!reason1 && reason1 === reason2;
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

  ngOnInit(): void {}

  submitTravel(event: any) {
    this.createMyTravel();
    console.log(this.myTravel, 'MyTravel');
    this.dataService.createOrUpdateTravel(this.myTravel);
    this.router.navigate(['/business/travel-list']);
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
      breakfast: this.breakfast,
      launch: this.launch,
      dinner: this.dinner,
      reason: this.reason,
      catering: this.myCatering,
      userId: 'ea5eg', // localStorage.getItem('userId')?.toString(),
    };
  }

  createTravelForm() {
    this.myTravelForm = this.fb.group({
      start: [''],
      startTime: [''],
      end: [''],
      endTime: [''],
      reason: [''],
      selectCustomer: [''],
      spends: this.fb.array([]),
      breakfast: [true],
      launch: [false],
      dinner: [false],
    });
  }

  onChanges() {
    this.myTravelForm.valueChanges.subscribe((val) => {
      this.setValue();
    });
  }

  getCustomer() {
    let c = this.dataService.getCustomerList();

    c.snapshotChanges().subscribe((data) => {
      this.customerList = [];
      data.forEach((item) => {
        let x = item.payload.toJSON();
        this.customerList.push(x as Customer);
      });
    });
  }

  newSpend(dates: any): FormGroup {
    console.log(dates.value, 'New');
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
    console.log(dates.value, 'Dates');
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

      //Set Catering
      this.myCatering = {
        breakfast: this.breakfast,
        launch: this.launch,
        dinner: this.dinner,
      };
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
