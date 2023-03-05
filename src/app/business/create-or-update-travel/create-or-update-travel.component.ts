import * as moment from 'moment';
import { map, Observable, startWith, tap } from 'rxjs';
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
  myCatering: Catering = { breakfast: true, launch: false, dinner: false };
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
  sDate;
  travelId;
  id;
  loading = false;
  file: File = null;

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

  upload(event) {
    this.file = event.target.files[0];
    console.log(this.file, 'Upload');
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

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.loading = true;
      this.dataService
        .getTravelById(this.id)
        .valueChanges()
        .pipe(tap((data) => console.log(data)))
        .subscribe((item) => {
          console.log(item, 'Item');
          this.createTravelForm(item);
          this.rate = item.rate;
          this.total = item.total;
          this.spendValue = item.spendValue;
          this.loading = false;
          this.createMyTravel();
          this.onChanges();
        });
    }
  }

  submit(event: any) {
    this.createMyTravel();
    if (this.id) {
      this.dataService.updateTravel(this.id, this.myTravel);
    } else {
      this.dataService.createTravel(this.myTravel);
    }
    this.router.navigate(['/business/travel-list']);
  }

  createMyTravel() {
    /*if (this.spends.length > 0) {
      this.mySpends.map((x) => (x.date = x.date.toString()));
    }*/
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

  /*ToDo Catering setzen*/
  createTravelForm(travel?: Travel) {
    if (travel) {
      this.myTravelForm = this.fb.group({
        start: new FormControl(new Date(travel.start)),
        startTime: new FormControl(this.formatTime(new Date(travel.start))),
        end: new FormControl(new Date(travel.end)),
        endTime: new FormControl(this.formatTime(new Date(travel.end))),
        reason: new FormControl(travel.reason),
        selectCustomer: new FormControl(travel.customer),
        spends: this.fb.array(
          travel.spend !== undefined
            ? travel.spend.map((spend) => this.newSpend(spend))
            : []
        ),
        breakfast: new FormControl(travel.catering.breakfast),
        launch: new FormControl(travel.catering.launch),
        dinner: new FormControl(travel.catering.dinner),
      });
    } else {
      this.myTravelForm = this.fb.group({
        start: new FormControl(''),
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
    }
  }

  onChanges() {
    this.myTravelForm.valueChanges.subscribe((val) => {
      console.log(this.myTravelForm.value, 'ChangesEvent');
      this.setValue();
      this.createMyTravel();
      console.log(this.myTravel, 'MyTravel');
    });
  }

  getCustomer() {
    this.dataService
      .getCustomers()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Customer;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.customerList = dates;
      });
  }

  newSpend(dates: any): FormGroup {
    console.log(dates.date, 'New');
    //this.sDate = new Date(dates.date);
    return this.fb.group({
      date: [new Date(dates.date)],
      value: [dates.value],
      type: [dates.type],
      text: [dates.text],
      file: [''],
    });
  }

  displayFn(customer: Customer): string {
    return customer && customer.name ? customer.name : '';
  }

  addSpend(dates: any): void {
    this.spends.push(this.newSpend(dates));
    console.log(this.spends, 'Spend');
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

    //Spends setzen
    if (this.start !== '') {
      this.startDate = this.start;
    }

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

      //Set Catering
      this.myCatering = {
        breakfast: this.breakfast,
        launch: this.launch,
        dinner: this.dinner,
      };

      this.rate = isNaN(
        Helpers.calcRate(diff, this.selectCustomer, this.myCatering)
      )
        ? 0
        : Helpers.calcRate(diff, this.selectCustomer, this.myCatering);

      this.total = this.rate + this.spendValue;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SpendsDialogComponent, {
      width: '600px',
      height: '600px',
      data: { start: this.start, end: this.end },
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
