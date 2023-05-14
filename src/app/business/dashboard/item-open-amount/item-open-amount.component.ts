import { map, tap } from 'rxjs/operators';
import { Travel } from 'src/app/models/travel';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-open-amount',
  templateUrl: './item-open-amount.component.html',
  styleUrls: ['./item-open-amount.component.scss'],
})
export class ItemOpenAmountComponent implements OnInit {
  openPaymentValue = 0;
  openPaymentDisplay = 0;
  openPaymentCount = 0;
  loading = true;
  @Input() data;

  ngOnInit(): void {
    this.data.subscribe((travels) => {
      this.openTravels(travels);
      console.log(travels);
      this.loading = false;
    });
  }

  openTravels(allTravels) {
    let myTravel: Travel[] = allTravels;
    console.log(allTravels, 'allTravels');
    const t = myTravel.filter(
      (x) => (x.isPaid === undefined ? false : true) == false
    );

    t.forEach((x) => {
      this.openPaymentValue += x.total;
    });
    this.animateOpen(this.openPaymentValue);
  }

  animateOpen(value) {
    const increaseValue = setInterval(() => {
      if (value <= this.openPaymentDisplay) {
        this.openPaymentDisplay = value;
        clearInterval(increaseValue);
      } else {
        this.openPaymentDisplay += 10;
      }
    }, 1);
  }
}
