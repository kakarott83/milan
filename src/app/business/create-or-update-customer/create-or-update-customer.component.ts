import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Customer } from '../../models/customer';

const countryList = [
  { name: 'Schweiz', rate: 64, halfRate: 32 },
  { name: 'Österreich', rate: 24, halfRate: 12 },
  { name: 'Deutschland', rate: 24, halfRate: 12 },
];

@Component({
  selector: 'app-create-or-update-customer',
  templateUrl: './create-or-update-customer.component.html',
  styleUrls: ['./create-or-update-customer.component.scss'],
})
export class CreateOrUpdateCustomerComponent {
  myCustomer: Customer = {};
  myCustomerForm: FormGroup;
  myCustomerList: Customer[] = [{}];
  countryList = countryList;

  constructor(private fb: FormBuilder) {
    this.myCustomerForm = fb.group({
      name: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
    });
  }

  get name() {
    return this.myCustomerForm.get('name')?.value;
  }

  get city() {
    return this.myCustomerForm.get('city')?.value;
  }

  get selectedCountry() {
    return this.myCustomerForm.get('country')?.value;
  }

  submit(e: Event) {
    this.createCustomer();
    console.log(this.myCustomer);
  }

  createCustomer() {
    this.myCustomer = {
      name: this.name,
      city: this.city,
      country: this.selectedCountry,
    };
  }
}
