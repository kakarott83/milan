import { getDatabase, limitToLast, query, ref } from 'firebase/database';
import { Observable, of } from 'rxjs';
import { Country } from 'src/app/models/country';
import { Customer } from 'src/app/models/customer';

import { Injectable } from '@angular/core';
import {
	AngularFireDatabase,
	AngularFireList,
	AngularFireObject,
} from '@angular/fire/compat/database';

import { Travel } from '../../models/travel';
import { Worktime } from '../../models/worktime';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  countryListRef: AngularFireList<any>;
  countryRef: AngularFireObject<any>;
  customerListRef: AngularFireList<any>;
  customerRef: AngularFireObject<any>;
  workTimeListRef: AngularFireList<any>;
  workTimeListByUserRef: AngularFireList<any>;
  workTimeRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
    this.countryListRef = db.list('/countries');
    this.customerListRef = db.list('/customers');
    this.workTimeListRef = db.list('/worktime');
  }

  //Hinzufügen
  addCountry(country: Country) {
    this.countryListRef.push({
      name: country.name,
      rate: country.rate,
      halfRate: country.halfRate,
    });
  }

  addCustomer(customer: Customer) {
    this.customerListRef.push({
      city: customer.city,
      name: customer.name,
      country: customer.country,
    });
  }

  createOrUpdateWorkTime(worktime: Worktime) {
    if (worktime.id !== '') {
      this.workTimeRef.update({
        start: worktime.start,
        end: worktime.end,
        duration: worktime.duration,
        break: worktime.break,
        comment: worktime.comment,
        userId: worktime.userId,
        date: worktime.date,
      });
    } else
      this.workTimeListRef.push({
        start: worktime.start,
        end: worktime.end,
        duration: worktime.duration,
        break: worktime.break,
        comment: worktime.comment,
        userId: worktime.userId,
        date: worktime.date,
      });
  }

  //Listen abrufen
  getCountryList() {
    this.countryListRef = this.db.list('/countries');
    return this.countryListRef;
  }

  getCustomerList() {
    this.customerListRef = this.db.list('/customers');
    return this.customerListRef;
  }

  getWorkTimeList() {
    this.workTimeListRef = this.db.list('/worktime');
    return this.workTimeListRef;
  }

  getWorkTimeListByUser(userId: string) {
    this.workTimeListRef = this.db.list('/worktime', (ref) =>
      ref.orderByChild('userId').equalTo(userId)
    );
    return this.workTimeListRef;
  }

  getWorkTimeById(id: string) {
    this.workTimeRef = this.db.object('/worktime/' + id);
    return this.workTimeRef;
  }
}
