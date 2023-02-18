import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Country } from '../../models/country';
import { CountryService } from '../../shared/service/country.service';
import { DataServiceService } from '../../shared/service/data-service.service';
import { NotificationService } from '../../shared/service/notification.service';

@Component({
  selector: 'app-create-or-update-country',
  templateUrl: './create-or-update-country.component.html',
  styleUrls: ['./create-or-update-country.component.scss'],
})
export class CreateOrUpdateCountryComponent implements OnInit {
  myCountry: Country = {};
  myCountryForm: FormGroup;
  myCountryList: Country[] = [{}];
  myCountries: any;
  filteredCountry: Observable<any[]>;
  countryControl = new FormControl();
  loading = false;
  id = '';

  constructor(
    private fb: FormBuilder,
    public dataService: DataServiceService,
    private countryService: CountryService,
    public notification: NotificationService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.createCountryForm();
  }

  ngOnInit(): void {
    this.getCountries();
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    //this.createCountryForm();
    if (this.id !== '') {
      this.dataService
        .getCountryById(this.id)
        .valueChanges()
        .pipe(tap((data) => console.log(data)))
        .subscribe((item) => {
          this.createCountryForm(item);
          this.loading = false;
        });
    }

    this.filteredCountry = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  filter() {
    console.log(this.myCountryForm.get('name')?.value);
    const value = this.myCountryForm.get('name')?.value;
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
    //this.dataService.createOrUpdateCountry(this.myCountry);
    if (this.id) {
      this.dataService.updateCountry(this.id, this.myCountry);
    } else {
      this.dataService.createCountry(this.myCountry);
    }
    this.router.navigate(['business/country-list']);
  }

  createCountryForm(country?: Country) {
    if (country) {
      this.myCountryForm = this.fb.group({
        name: new FormControl(country.name),
        rate: new FormControl(country.rate),
        halfRate: new FormControl(country.halfRate),
        id: new FormControl({ value: this.id, disabled: true }),
      });
    } else {
      this.myCountryForm = this.fb.group({
        name: new FormControl(''),
        rate: new FormControl(''),
        halfRate: new FormControl(''),
        id: new FormControl(''),
      });
    }
  }

  createCountry() {
    this.myCountry = {
      name: this.name,
      rate: this.rate,
      halfRate: this.halfRate,
      id: this.id,
    };
  }

  async getCountries() {
    await this.countryService.getAllCounties().then((data) => {
      console.log(data);
      this.myCountries = data;
    });
  }

  //*ToDo Liste wird nicht gefiltert
  private _filter(value: string): any[] {
    return this.myCountries.filter((country) => country.name.official);
  }
}
