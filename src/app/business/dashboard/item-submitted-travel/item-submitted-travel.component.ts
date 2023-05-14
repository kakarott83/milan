import { Travel } from 'src/app/models/travel';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-submitted-travel',
  templateUrl: './item-submitted-travel.component.html',
  styleUrls: ['./item-submitted-travel.component.scss'],
})
export class ItemSubmittedTravelComponent implements OnInit {
  unSubmittedCount = 0;
  unSubmittedDisplay = 0;
  loading = true;
  @Input() data;

  ngOnInit(): void {
    this.data.subscribe((travels) => {
      this.unSubmittedTravels(travels);
      console.log(travels);
      this.loading = false;
    });
  }

  unSubmittedTravels(allTravels) {
    let myTravel: Travel[] = allTravels;
    const t = myTravel.filter(
      (x) => (x.isSubmitted === undefined ? false : true) == false
    );

    t.forEach((x) => {
      this.unSubmittedCount++;
    });
    this.animateUnSumbittedTravel(this.unSubmittedCount);
  }

  animateUnSumbittedTravel(counter) {
    const increaseCounter = setInterval(() => {
      if (counter === this.unSubmittedDisplay) {
        clearInterval(increaseCounter);
      } else {
        this.unSubmittedDisplay++;
      }
    }, 300);
  }
}
