import * as moment from 'moment';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';

import { Worktime } from '../../models/worktime';
import { Helpers } from '../../shared/material/Helpers';
import { DataServiceService } from '../../shared/service/data-service.service';

@Component({
  selector: 'app-worktime',
  templateUrl: './worktime.component.html',
  styleUrls: ['./worktime.component.scss'],
})
export class WorktimeComponent implements OnInit {
  selected: Date | null = new Date();
  selectedTime: any;
  selectedWt: any;
  dateDiff: any;
  wtDuration: any;
  myWorktime!: Worktime;
  viewMonth: any;
  date = new FormControl(moment());
  public loading = false;
  userid = 'ea5eg'; // localStorage.getItem('userId');
  datesToHighlight = [];
  calcDates = [];
  infoDate: any;
  infoWt: any;
  infoBreak: any;
  workTimes: Worktime[];

  workTimeForm: FormGroup;

  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  constructor(
    private fb: FormBuilder,
    private dataService: DataServiceService
  ) {
    this.createWorkTimeForm();

    //Dummy
    localStorage.setItem('userId', 'ea5eg');

    this.updateTime();
    this.createWorktime();
    this.getWorktime();
    this.changeSelectedDate();
  }

  //Getter
  public get wtStart() {
    return this.workTimeForm.get('wtStart')?.value;
  }

  public get wtEnd() {
    return this.workTimeForm.get('wtEnd')?.value;
  }

  public get wtBreak() {
    return this.workTimeForm.get('wtBreak')?.value;
  }

  public get wtComment() {
    return this.workTimeForm.get('wtComment')?.value;
  }

  ngOnInit(): void {
    this.loading = true;
    this.getWorktime();
  }

  submit(event: Event) {
    this.createWorktime();
    console.log(this.myWorktime);
    this.dataService.createOrUpdateWorkTime(this.myWorktime);
  }

  createWorkTimeForm(myWorkTime?: Worktime) {
    if (myWorkTime) {
      this.workTimeForm = this.fb.group({
        wtStart: new FormControl(myWorkTime.start),
        wtEnd: new FormControl(myWorkTime.end),
        wtBreak: new FormControl(myWorkTime.break),
        wtComment: new FormControl(myWorkTime.comment),
      });
    } else
      this.workTimeForm = this.fb.group({
        wtStart: new FormControl('08:00'),
        wtEnd: new FormControl('17:00'),
        wtBreak: new FormControl('01:00'),
        wtComment: new FormControl(''),
      });
  }

  updateTime(event?: any) {
    console.log(this.workTimeForm.value);
    if (
      this.workTimeForm.get('wtStart')?.value !== '' &&
      this.workTimeForm.get('wtEnd')?.value !== ''
    ) {
      let end = moment(this.workTimeForm.get('wtEnd')?.value, 'HH:mm');
      let start = moment(this.workTimeForm.get('wtStart')?.value, 'HH:mm');
      let breakTime = moment(this.workTimeForm.get('wtBreak')?.value, 'HH:mm');

      //Substract Break
      let endWithoutBreakH = end.subtract(breakTime.hours(), 'hours');
      let endWithoutBreakM = endWithoutBreakH.subtract(
        breakTime.minutes(),
        'minutes'
      );

      this.wtDuration = moment
        .utc(endWithoutBreakM.diff(start))
        .format('HH:mm');

      this.createWorktime();
    }
  }

  createWorktime() {
    this.myWorktime = {
      start: this.wtStart == null ? '' : this.wtStart.toString(),
      end: this.wtEnd == null ? '' : this.wtEnd.toString(),
      break: this.wtBreak == null ? '' : this.wtBreak.toString(),
      duration: this.wtDuration == null ? '' : this.wtDuration.toString(),
      comment: this.wtComment == null ? '' : this.wtComment.toString(),
      userId: localStorage.getItem('userId').toString(),
      date: this.selected.toISOString(),
    };
  }

  addEvent(event?: Event) {
    console.log(this.selected);
    console.log(this.workTimeForm.value);
    console.log(event);
  }

  /*getWorktime() {
    let t = this.dataService.getWorkTimeListByUser(this.userid);
    this.loading = true;
    t.snapshotChanges().subscribe((data) => {
      this.datesToHighlight = [];
      this.calcDates = [];
      data.forEach((item) => {
        let x = item.payload.toJSON() as Worktime;
        x['id'] = item.key;
        this.calcDates.push(x);
        this.datesToHighlight.push(x.date);
      });
      this.calcWorktime(this.calcDates);
      this.calendar.updateTodaysDate();
      this.loading = false;
    });
  }*/

  getWorktime() {
    this.dataService
      .getWorktimes()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Worktime;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.workTimes = dates;
        this.loading = false;
      });
  }

  changeSelectedDate(event?: Event) {
    this.infoDate = moment(this.selected).format('MMMM yyyy');
    this.createWorkTimeForm();
    this.calcWorktime(this.calcDates);
    if (this.calcDates.length > 0) {
      this.selectedWt = this.calcDates.find(
        (item: Worktime) => item.date === this.selected.toISOString()
      );
      if (this.selectedWt !== undefined) {
        this.dataService
          .getWorkTimeById(this.selectedWt.id)
          .snapshotChanges()
          .subscribe((item) => {
            let x = item.payload.data();
            x['id'] = item.payload.id;
            this.myWorktime = x as Worktime;
            console.log(this.myWorktime, 'MyWorktime');
            this.createWorkTimeForm(this.myWorktime);
          });
      }
    }
  }

  calcWorktime(dates: Worktime[]) {
    this.infoWt = null;

    const filteredDates = dates.filter(
      (x) =>
        new Date(x.date).getMonth() === this.selected.getMonth() &&
        new Date(x.date).getFullYear() === this.selected.getFullYear()
    );

    const wt = filteredDates.reduce(
      (prev, curr) => moment.duration(curr.duration).add(prev),
      moment.duration(0)
    );
    const breakTime = filteredDates.reduce(
      (prev, curr) => moment.duration(curr.break).add(prev),
      moment.duration(0)
    );

    this.infoWt = Helpers.convertMsToHM(wt.asMilliseconds());
    this.infoBreak = Helpers.convertMsToHM(breakTime.asMilliseconds());
  }

  //Setzen der erfassten Tage
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
        .map((strDate) => new Date(strDate))
        .some(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );
      return highlightDate ? 'special-date' : '';
    };
  }
}
