import * as moment from 'moment';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { Component, OnInit } from '@angular/core';

import { Travel } from '../../models/travel';
import { Worktime } from '../../models/worktime';
import { Helpers } from '../../shared/material/Helpers';
import { DashboardService } from '../../shared/service/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  weekTime = 40;
  weekTimeIs = '';
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
    let dur = moment.duration('00:00');
    /*Aktuelle Arbeitszeit*/
    this.dashBoardService.getWorktimePerWeek(this.userid).subscribe((ws) => {
      this.weekTimeIs = this.addTime(ws).toString();
      this.loadingWeekTime = false;
    });
  }

  getTravels() {
    this.dashBoardService.getTravels(this.userid).subscribe((dates) => {
      this.allTravels = dates;
      this.loadLastTravel();
      this.travelState();
    });
  }

  loadLastTravel() {
    this.loadingLastTravel = true;
    this.lastTravel = this.allTravels.sort((a, b) => {
      return new Date(a.end).getDate() > new Date(b.end).getDate() ? -1 : 1;
    })[0];
    this.loadingLastTravel = false;
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

  addTime(worktimes: Worktime[]) {
    let duration = 0;
    worktimes.forEach((ws) => {
      duration = duration + moment.duration(ws.duration).as('milliseconds');
    });
    return moment.duration(duration).asHours();
  }
}
