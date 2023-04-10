import * as moment from 'moment';

import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Travel } from '../../models/travel';

@Component({
  selector: 'app-travel-detail',
  templateUrl: './travel-detail.component.html',
  styleUrls: ['./travel-detail.component.scss'],
})
export class TravelDetailComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() travelForm: FormGroup;
  @Input() travel: Travel;
  @Input() id = '';

  durDays = 0;
  durHours = 0;
  rate = 0;
  spendValue = 0;
  total = 0;
  userId = '';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.travelForm.valueChanges.subscribe((data) => {
      console.log(this.travelForm.value, 'Detail');
      this.setTravelValue();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.travel !== undefined) {
      this.setTravelValue();
    }
  }

  setTravelValue() {
    if (this.travel !== undefined) {
      //console.log(this.travel, 'SetDetailValue');
      this.rate = this.travel.rate;
      this.spendValue = this.travel.spendValue;
      this.total = this.travel.total;
      this.userId = this.travel.userId;
    }
  }
}
