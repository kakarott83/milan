import * as moment from 'moment';
import { Subject } from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Worktime } from 'src/app/models/worktime';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { Component, OnInit } from '@angular/core';

import { Travel } from '../../models/travel';
import { Helpers } from '../../shared/material/Helpers';
import { DashboardService } from '../../shared/service/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = false;
  lastTravel: Travel;
  allTravels: Travel[] = [];
  userid = 'ea5eg';
  weekDuration = '';
  loadingWeekTime = false;
  loadingLastTravel = false;
  loadingOpenPayments = false;
  loadingUnSubmitted = false;
  openPaymentValue = 0;
  openPaymentCount = 0;
  unSubmitCount = 0;
  private wsDates = new Subject<Worktime[]>();
  private travelDates = new Subject<Travel[]>();
  wsDateObservable = this.wsDates.asObservable();
  travelDateOberservable = this.travelDates.asObservable();
  //localStorage.setItem('userId', 'ea5eg');

  constructor(private dashBoardService: DashboardService) {}

  ngOnInit(): void {
    this.loadingWeekTime = true;
    this.loadingLastTravel = true;
    this.loadingOpenPayments = true;
    this.loadingUnSubmitted = true;

    this.loadWorktime();
    this.getTravels();
  }

  loadWorktime() {
    let currDate = new Date();
    currDate.setHours(0);
    currDate.setMinutes(0);
    /*Aktuelle Arbeitszeit*/
    this.dashBoardService.getWorktimePerWeek(this.userid).subscribe((ws) => {
      this.wsDates.next(ws);
    });
  }

  getTravels() {
    this.dashBoardService.getTravels(this.userid).subscribe((dates) => {
      this.allTravels = dates;
      this.travelDates.next(dates);
      this.travelState();
    });
  }

  travelState() {
    let openPay = 0;
    let openSubmittedCount = 0;
    this.allTravels.forEach((x) => {
      if (
        x.isPaid === false ||
        (x.isSubmitted === undefined && x.isSubmitted === true)
      ) {
        openPay += Number(x.total);
        this.openPaymentCount += 1;
      }
      if (x.isSubmitted === false || x.isSubmitted === undefined) {
        openSubmittedCount += 1;
      }
    });
    this.openPaymentValue = openPay;
    this.unSubmitCount = openSubmittedCount;
    this.loadingOpenPayments = false;
    this.loadingUnSubmitted = false;
  }
}
