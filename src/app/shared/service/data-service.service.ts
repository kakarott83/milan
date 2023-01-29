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

import { AppUser } from '../../models/appUser';
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
  workTimeRef: AngularFireObject<any>;
  travelListRef: AngularFireList<any>;
  travelRef: AngularFireObject<any>;
  userListRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
    this.countryListRef = db.list('/countries');
    this.customerListRef = db.list('/customers');
    this.workTimeListRef = db.list('/worktimes');
    this.travelListRef = db.list('/travels');
    this.userListRef = db.list('/users');
  }

  //Hinzufügen
  addCountry(country: Country) {
    this.countryListRef.push({
      name: country.name,
      rate: country.rate,
      halfRate: country.halfRate,
    });
  }

  addAppUser(appUser: AppUser) {
    this.userListRef.push({
      name: appUser.name,
      uid: appUser.uid,
    });
  }

  createOrUpdateAppUser(appUser: AppUser) {
    if (appUser.id !== '') {
      this.userRef.update({
        name: appUser.name,
        uid: appUser.uid,
      });
    } else {
      this.userListRef.push({
        name: appUser.name,
        uid: appUser.uid,
      });
    }
  }

  createOrUpdateCountry(country: Country) {
    if (country.id !== '') {
      this.countryRef.update({
        name: country.name,
        rate: country.rate,
        halfRate: country.halfRate,
      });
    } else {
      this.countryListRef.push({
        name: country.name,
        rate: country.rate,
        halfRate: country.halfRate,
      });
    }
  }

  addCustomer(customer: Customer) {
    this.customerListRef.push({
      city: customer.city,
      name: customer.name,
      country: customer.country,
    });
  }

  createOrUpdateCustomer(customer: Customer) {
    if (customer.id !== '') {
      this.customerRef.update({
        city: customer.city,
        name: customer.name,
        country: customer.country,
      });
    } else
      this.customerListRef.push({
        city: customer.city,
        name: customer.name,
        country: customer.country,
      });
  }

  createOrUpdateTravel(travel: Travel) {
    if (travel.id !== '' && travel.id !== undefined) {
      this.travelRef.update({
        start: travel.start,
        end: travel.end,
        spend: travel.spend,
        customer: travel.customer,
        rate: travel.rate,
        spendValue: travel.spendValue,
        total: travel.total,
        catering: travel.catering,
        reason: travel.reason,
        userId: travel.userId,
      });
    } else {
      this.travelListRef.push({
        start: travel.start,
        end: travel.end,
        spend: travel.spend,
        customer: travel.customer,
        rate: travel.rate,
        spendValue: travel.spendValue,
        total: travel.total,
        catering: travel.catering,
        reason: travel.reason,
        userId: travel.userId,
      });
    }
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

  getCountryById(id: string) {
    this.countryRef = this.db.object('/countries/' + id);
    return this.countryRef;
  }

  getCustomerById(id: string) {
    this.customerRef = this.db.object('/customers/' + id);
    return this.customerRef;
  }

  getTravelById(id: string) {
    this.travelRef = this.db.object('/travels/' + id);
    return this.travelRef;
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

  getAppUserByUid(uid: string) {
    this.userRef = this.db.object('/users/' + uid);
    return this.userRef;
  }

  getWorkTimeList() {
    this.workTimeListRef = this.db.list('/worktimes');
    return this.workTimeListRef;
  }

  getWorkTimeListByUser(userId: string) {
    this.workTimeListRef = this.db.list('/worktimes', (ref) =>
      ref.orderByChild('userId').equalTo(userId)
    );
    return this.workTimeListRef;
  }

  getTravelListByUser(userId: string) {
    this.travelListRef = this.db.list('travels', (ref) =>
      ref.orderByChild('userId').equalTo(userId)
    );
    return this.travelListRef;
  }

  getTravelList() {
    this.travelListRef = this.db.list('travels');
    return this.travelListRef;
  }

  getWorkTimeById(id: string) {
    this.workTimeRef = this.db.object('/worktimes/' + id);
    return this.workTimeRef;
  }

  deleteCountry(id: string) {
    this.countryRef = this.db.object('countries/' + id);
    this.countryRef.remove();
  }

  deleteWorktime(id: string) {
    this.workTimeRef = this.db.object('worktimes/' + id);
    this.workTimeRef.remove();
  }

  deleteTravel(id: string) {
    this.travelRef = this.db.object('travels/' + id);
    this.travelRef.remove();
  }

  deleteCustomer(id: string) {
    this.customerRef = this.db.object('customers/' + id);
    this.customerRef.remove();
  }
}
