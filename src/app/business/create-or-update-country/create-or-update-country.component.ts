import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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

  constructor(
    private fb: FormBuilder,
    public dataService: DataServiceService,
    private countryService: CountryService,
    public notification: NotificationService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.getCountries();
    const id = activeRoute.snapshot.paramMap.get('id');
    if (id !== '') {
      let c = dataService.getCountryById(id);
      c.snapshotChanges().subscribe((country) => {
        this.myCountry = country.payload.toJSON();
        if (country.key !== null) {
          this.myCountry.id = country.key.toString();
        }
        this.createCountryForm(this.myCountry);
      });
    } else {
      this.createCountryForm();
    }

    this.myCountryForm = fb.group({
      name: new FormControl(''),
      rate: new FormControl(''),
      halfRate: new FormControl(''),
      id: new FormControl(''),
    });
  }

  ngOnInit(): void {
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

  get id() {
    return this.myCountryForm.get('id')?.value;
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
    this.dataService.createCountry(this.myCountry);
    this.router.navigate(['business/country-list']);
  }

  createCountryForm(country?: Country) {
    if (country) {
      this.myCountryForm = this.fb.group({
        name: new FormControl(country.name),
        rate: new FormControl(country.rate),
        halfRate: new FormControl(country.halfRate),
        id: new FormControl({ value: country.id, disabled: true }),
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
