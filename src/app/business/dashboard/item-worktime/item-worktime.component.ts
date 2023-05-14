import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Worktime } from 'src/app/models/worktime';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-worktime',
  templateUrl: './item-worktime.component.html',
  styleUrls: ['./item-worktime.component.scss'],
})
export class ItemWorktimeComponent implements OnInit {
  weekTimeIs;
  loading = true;
  @Input() data;

  ngOnInit(): void {
    //this.animateWorkTime(this.addTime(this.data));
    console.log(this.data, 'Data');
    this.data.subscribe((ws) => {
      this.animateWorkTime(this.addTime(ws));
      this.loading = false;
    });
  }

  animateWorkTime(timeTo) {
    let duration = timeTo;
    let x = moment.duration(duration);
    let counterMin = 15;
    let time = moment.duration('00:00');
    let endTime = x;

    const increaseTimer = setInterval(() => {
      time = time.add(counterMin, 'minutes');
      let displayTimer = moment.duration(time, 'milliseconds');
      let z = Number(displayTimer.asHours().toString()).toFixed(2);
      let x = z.replace('.', ':');

      this.weekTimeIs = x;

      if (
        endTime.toISOString() === displayTimer.toISOString() ||
        displayTimer.toISOString().includes('PT100')
      ) {
        clearInterval(increaseTimer);
      }
    }, 1);
  }

  addTime(worktimes: Worktime[]) {
    console.log(worktimes, 'Worktime');
    let duration = 0;
    worktimes.forEach((ws) => {
      duration = duration + moment.duration(ws.duration).as('milliseconds');
    });
    return duration;
  }
}
