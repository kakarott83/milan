import * as moment from 'moment';
import { Observable } from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Travel } from 'src/app/models/travel';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { Injectable } from '@angular/core';

import { Worktime } from '../../models/worktime';
import { Helpers } from '../material/Helpers';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private dataService: DataServiceService) {}

  today = moment();
  week = this.today.week();
  dayOfWeek = this.today.weekday();
  startWeek = this.today.isoWeek(this.week - 1);

  myIsoWeekDay = 1; // say our weeks start on tuesday, for monday you would type 1, etc.
  startOfPeriod = moment();

  // how many days do we have to substract?
  daysToSubtract =
    moment(this.startOfPeriod).isoWeekday() >= this.myIsoWeekDay
      ? moment(this.startOfPeriod).isoWeekday() - this.myIsoWeekDay
      : 7 + moment(this.startOfPeriod).isoWeekday() - this.myIsoWeekDay;

  // subtract days from start of period
  beginn = moment(this.startOfPeriod).subtract('d', this.daysToSubtract);

  getWorktimePerWeek(userId): Observable<Worktime[]> {
    let currDate = new Date();
    currDate.setHours(0);
    currDate.setMinutes(0);
    let dur = moment(currDate);
    return this.dataService
      .getWorktimes()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.doc.data() as Worktime;
              data.id = a.payload.doc.id;
              return { ...data };
            })
            .filter(
              (d) =>
                d.userId == userId && moment(d.date).isSameOrAfter(this.beginn)
            )
        )
      );
  }

  getTravels(userId): Observable<Travel[]> {
    return this.dataService
      .getTravels()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.doc.data() as Travel;
              data.id = a.payload.doc.id;
              return { ...data };
            })
            .filter((d) => d.userId == userId)
        )
      );
  }
}
