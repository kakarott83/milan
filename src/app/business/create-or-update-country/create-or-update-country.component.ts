import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Country } from '../../models/country';

@Component({
  selector: 'app-create-or-update-country',
  templateUrl: './create-or-update-country.component.html',
  styleUrls: ['./create-or-update-country.component.scss'],
})
export class CreateOrUpdateCountryComponent {
  myCountry: Country = {};
  myCountryForm: FormGroup;
  myCountryList: Country[] = [{}];

  constructor(private fb: FormBuilder) {
    this.myCountryForm = fb.group({
      name: new FormControl(''),
      rate: new FormControl(''),
      halfRate: new FormControl(''),
    });
  }

  get name() {
    return this.myCountryForm.get('name')?.value;
  }

  get rate() {
    return this.myCountryForm.get('rate')?.value;
  }
  get halfRate() {
    return this.myCountryForm.get('halfRate')?.value;
  }

  submit(e: Event) {
    this.createCountry();
    console.log(this.myCountry);
  }

  createCountry() {
    this.myCountry = {
      name: this.name,
      rate: this.rate,
      halfRate: this.halfRate,
    };
  }
}
