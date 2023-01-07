import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Country } from '../../models/country';
import { DataServiceService } from '../../shared/service/data-service.service';

@Component({
  selector: 'app-create-or-update-country',
  templateUrl: './create-or-update-country.component.html',
  styleUrls: ['./create-or-update-country.component.scss'],
})
export class CreateOrUpdateCountryComponent {
  myCountry: Country = {};
  myCountryForm: FormGroup;
  myCountryList: Country[] = [{}];

  constructor(
    private fb: FormBuilder,
    public dataService: DataServiceService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    const id = activeRoute.snapshot.paramMap.get('id');
    console.log(id, 'Id');
    if (id !== '') {
      let c = dataService.getCountryById(id);
      c.snapshotChanges().subscribe((country) => {
        this.myCountry = country.payload.toJSON();
        this.createCountryForm(this.myCountry);
      });
    } else {
      this.createCountryForm();
    }

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
    this.dataService.addCountry(this.myCountry);
    this.router.navigate(['business/country-list']);
  }

  createCountryForm(country?: Country) {
    if (country) {
      this.myCountryForm = this.fb.group({
        name: new FormControl(country.name),
        rate: new FormControl(country.rate),
        halfRate: new FormControl(country.halfRate),
      });
    } else {
      this.myCountryForm = this.fb.group({
        name: new FormControl(''),
        rate: new FormControl(''),
        halfRate: new FormControl(''),
      });
    }
  }

  createCountry() {
    this.myCountry = {
      name: this.name,
      rate: this.rate,
      halfRate: this.halfRate,
    };
  }
}
