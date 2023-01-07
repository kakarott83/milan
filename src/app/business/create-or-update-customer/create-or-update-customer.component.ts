import { Country } from 'src/app/models/country';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
export class CreateOrUpdateCustomerComponent implements OnInit, AfterViewInit {
  myCustomer: Customer = {};
  myCustomerForm: FormGroup;
  myCustomerList: Customer[] = [{}];
  countryList = countryList;
  countries: Country[];
  loading = false;
  //selectCountry: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataServiceService,
    private activeRoute: ActivatedRoute
  ) {
    this.getCountryList();
  }

  ngOnInit(): void {
    this.createCustomerForm();
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.dataService
        .getCustomerById(id)
        .snapshotChanges()
        .subscribe((data) => {
          this.myCustomer = data.payload.toJSON();
          this.myCustomerForm.patchValue({
            name: this.myCustomer.name,
            city: this.myCustomer.city,
          });
          const toSelectCountry = this.myCustomer.country;
          this.myCustomerForm.get('country').setValue(toSelectCountry);
        });
    }
  }

  ngAfterViewInit(): void {}

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

  createCustomerForm() {
    this.myCustomerForm = this.fb.group({
      name: [this.myCustomer.name],
      city: [this.myCustomer.city],
      country: [''],
    });
  }

  createCustomer() {
    this.myCustomer = {
      name: this.name,
      city: this.city,
      country: this.selectedCountry,
    };
  }

  getCountryList() {
    let c = this.dataService.getCountryList();
    this.loading = true;
    c.snapshotChanges().subscribe((data) => {
      this.countries = [];
      data.forEach((item) => {
        let x = item.payload.toJSON();
        this.countries.push(x as Country);
      });
      this.loading = false;
    });
  }

  isSameCountry(country1: Country, country2: Country): boolean {
    // vergleicht die Länderliste
    // console.log(country1.name + ' ' + country2.name, 'Comp');
    return !!country1 && country1.name === country2.name;
  }
}
