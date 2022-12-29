import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

import { Worktime } from '../../models/worktime';

@Component({
  selector: 'app-worktime',
  templateUrl: './worktime.component.html',
  styleUrls: ['./worktime.component.scss'],
})
export class WorktimeComponent implements OnInit {
  selected: Date | null = new Date();
  selectedTime: any;
  dateDiff: any;
  wtDuration: any;
  myWorktime!: Worktime;
  viewMonth: any;
  date = new FormControl(moment());

  //MockDates
  datesToHighlight = [
    '2022-11-22T18:30:00.000Z',
    '2022-12-22T18:30:00.000Z',
    '2022-12-24T18:30:00.000Z',
    '2022-12-27T18:30:00.000Z',
    '2022-12-29T18:30:00.000Z',
  ];

  workTimeForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.workTimeForm = this.fb.group({
      wtStart: new FormControl('08:00'),
      wtEnd: new FormControl('17:00'),
      wtBreak: new FormControl('01:00'),
      wtComment: new FormControl(''),
    });

    this.updateTime();
    this.createWorktime();
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
    console.log('Init');
  }

  submit(event: Event) {
    this.createWorktime();
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
    };
  }

  addEvent(event?: Event) {
    console.log(this.selected);
    console.log(this.workTimeForm.value);
    console.log(event);
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
