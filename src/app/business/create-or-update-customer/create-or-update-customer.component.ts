import { map, tap } from 'rxjs/operators';
import { Country } from 'src/app/models/country';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Customer } from '../../models/customer';
import { DataServiceService } from '../../shared/service/data-service.service';

@Component({
  selector: 'app-create-or-update-customer',
  templateUrl: './create-or-update-customer.component.html',
  styleUrls: ['./create-or-update-customer.component.scss'],
})
export class CreateOrUpdateCustomerComponent implements OnInit {
  myCustomer: Customer = {};
  myCustomerForm: FormGroup;
  myCustomerList: Customer[] = [{}];
  countryList = {};
  countries: Country[];
  loading = false;
  id = '';
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
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.dataService
        .getCustomerById(this.id)
        .valueChanges()
        .pipe(tap((data) => console.log(data)))
        .subscribe((item) => {
          this.createCustomerForm(item);
          this.loading = false;
        });
    }
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
    if (this.id) {
      this.dataService.updateCustomer(this.id, this.myCustomer);
    } else {
      this.dataService.createCustomer(this.myCustomer);
    }
    this.router.navigate(['business/customer-list']);
  }

  createCustomerForm(customer?: Customer) {
    if (customer) {
      this.myCustomerForm = this.fb.group({
        name: new FormControl(customer.name),
        city: new FormControl(customer.city),
        id: new FormControl({ value: this.id, disabled: true }),
        country: new FormControl(customer.country),
      });
    } else {
      this.myCustomerForm = this.fb.group({
        name: new FormControl(''),
        city: new FormControl(''),
        id: new FormControl(''),
        country: [''],
      });
    }
  }

  createCustomer() {
    this.myCustomer = {
      name: this.name,
      city: this.city,
      country: this.selectedCountry,
    };
  }

  getCountryList() {
    this.dataService
      .getCountries()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Country;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.countries = dates;
      });
  }

  isSameCountry(country1: Country, country2: Country): boolean {
    // vergleicht die Länderliste
    // console.log(country1.name + ' ' + country2.name, 'Comp');
    return !!country1 && country1.name === country2.name;
  }
}
