import { Country } from 'src/app/models/country';

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Customer } from '../../models/customer';
import { DataServiceService } from '../../shared/service/data-service.service';

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
  countries: Country[];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataServiceService
  ) {
    this.myCustomerForm = fb.group({
      name: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
    });

    let c = dataService.getCountryList();
    this.loading = true;
    c.snapshotChanges().subscribe((data) => {
      this.countries = [];
      data.forEach((item) => {
        let x = item.payload.toJSON();
        this.countries.push(x as Country);
      });
      console.log(this.countries);
      this.loading = false;
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
    this.dataService.addCustomer(this.myCustomer);
    this.router.navigate(['business/customer-list']);
  }

  createCustomer() {
    this.myCustomer = {
      name: this.name,
      city: this.city,
      country: this.selectedCountry,
    };
  }
}
