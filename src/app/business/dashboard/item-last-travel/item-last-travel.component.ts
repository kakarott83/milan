import { Travel } from 'src/app/models/travel';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-last-travel',
  templateUrl: './item-last-travel.component.html',
  styleUrls: ['./item-last-travel.component.scss'],
})
export class ItemLastTravelComponent implements OnInit {
  lastTravel: Travel;
  loading = true;
  @Input() data;

  ngOnInit(): void {
    this.data.subscribe((travel) => {
      this.loadLastTravel(travel);
      this.loading = false;
    });
  }

  loadLastTravel(travels: Travel[]) {
    this.lastTravel = travels.sort((a, b) => {
      return new Date(a.end).getDate() > new Date(b.end).getDate() ? -1 : 1;
    })[0];
    this.loading = false;
  }
}
