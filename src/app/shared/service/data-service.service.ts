import { child, getDatabase, limitToLast, query, ref } from 'firebase/database';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Country } from 'src/app/models/country';
import { Customer } from 'src/app/models/customer';

import { Injectable } from '@angular/core';
import {
	AngularFireDatabase,
	AngularFireList,
	AngularFireObject,
} from '@angular/fire/compat/database';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { AppUser } from '../../models/appUser';
import { Travel } from '../../models/travel';
import { Worktime } from '../../models/worktime';
import { NotificationService } from './notification.service';

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

  private countriesDbPath = '/countries';
  private customersDbPath = '/customers';
  private travelsDbPath = '/travels';
  private worktimesDbPath = '/worktimes';
  fsCustomerRef: AngularFirestoreCollection<Customer>;
  fsCountryRef: AngularFirestoreCollection<Country>;
  fsTravelRef: AngularFirestoreCollection<Travel>;
  fsWorktimeRef: AngularFirestoreCollection<Worktime>;

  constructor(
    private db: AngularFireDatabase,
    private notification: NotificationService,
    private firestore: AngularFirestore
  ) {
    this.countryListRef = db.list('/countries');
    this.customerListRef = db.list('/customers');
    this.workTimeListRef = db.list('/worktimes');
    this.travelListRef = db.list('/travels');
    this.userListRef = db.list('/users');

    this.fsCustomerRef = firestore.collection(this.customersDbPath);
    this.fsCountryRef = firestore.collection(this.countriesDbPath);
    this.fsTravelRef = firestore.collection(this.travelsDbPath);
    this.fsWorktimeRef = firestore.collection(this.worktimesDbPath);
  }

  //Hinzufügen
  addCountry(country: Country) {
    return this.countryListRef.push({
      name: country.name,
      rate: country.rate,
      halfRate: country.halfRate,
    });
  }

  //Refernez https://www.bezkoder.com/angular-15-firestore-crud/
  createCustomer(customer: Customer): any {
    return this.fsCustomerRef.add({ ...customer });
  }

  createCountry(country: Country): any {
    return this.fsCountryRef.add({ ...country });
  }

  createTravel(travel: Travel): any {
    return this.fsCustomerRef.add({ ...travel });
  }

  createWorktime(worktime: Worktime): any {
    return this.fsCustomerRef.add({ ...worktime });
  }

  getCustomers(): AngularFirestoreCollection<Customer> {
    return this.fsCountryRef;
  }
  getCountries(): AngularFirestoreCollection<Country> {
    return this.fsCountryRef;
  }
  getTravels(): AngularFirestoreCollection<Travel> {
    return this.fsTravelRef;
  }
  getWorktimes(): AngularFirestoreCollection<Worktime> {
    return this.fsWorktimeRef;
  }

  updateCustomer(id: string, data: any): Promise<void> {
    return this.fsCustomerRef.doc(id).update(data);
  }
  updateCountry(id: string, data: any): Promise<void> {
    return this.fsCountryRef.doc(id).update(data);
  }
  updateTravel(id: string, data: any): Promise<void> {
    return this.fsTravelRef.doc(id).update(data);
  }
  updateWorktime(id: string, data: any): Promise<void> {
    return this.fsWorktimeRef.doc(id).update(data);
  }

  deleteCustomerById(id: string): Promise<void> {
    return this.fsCustomerRef.doc(id).delete();
  }
  deleteCountryById(id: string): Promise<void> {
    return this.fsCountryRef.doc(id).delete();
  }
  deleteTravelById(id: string): Promise<void> {
    return this.fsTravelRef.doc(id).delete();
  }
  deleteWorktimeById(id: string): Promise<void> {
    return this.fsWorktimeRef.doc(id).delete();
  }

  addAppUser(appUser: AppUser) {
    this.userRef = this.db.object('/users/' + appUser.uid);
    this.userRef.set(appUser);
  }

  createOrUpdateAppUser(appUser: AppUser) {
    console.log(appUser.id);
    if (appUser.id !== '') {
      this.userRef.update({
        name: appUser.name,
        uid: appUser.uid,
        email: appUser.email,
        createdAt: appUser.createdAt,
      });
    } else {
      this.userListRef.push({
        name: appUser.name,
        uid: appUser.uid,
        email: appUser.email,
        createdAt: appUser.createdAt,
      });
    }
  }

  createOrUpdateCountry(country: Country) {
    if (country.id.toString() !== '') {
      this.countryRef
        .update({
          id: country.id,
          name: country.name,
          rate: country.rate,
          halfRate: country.halfRate,
        })
        .then(() => {
          this.notification.showSuccess('Land', 'Land erfolgreich gespeichert');
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Land',
            'Änderung konnte nicht gespeichert werden'
          );
        });
    } else {
      this.countryListRef
        .push({
          name: country.name,
          rate: country.rate,
          halfRate: country.halfRate,
        })
        .then(() => {
          this.notification.showSuccess('Land', 'Land erfolgreich gespeichert');
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Land',
            'Änderung konnte nicht gespeichert werden'
          );
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
      this.customerRef
        .update({
          city: customer.city,
          name: customer.name,
          country: customer.country,
        })
        .then(() => {
          this.notification.showSuccess(
            'Kunde',
            'Kunde erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Kunde',
            'Änderung konnte nicht gespeichert werden'
          );
        });
    } else
      this.customerListRef
        .push({
          city: customer.city,
          name: customer.name,
          country: customer.country,
        })
        .then(() => {
          this.notification.showSuccess(
            'Kunde',
            'Kunde erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Kunde',
            'Änderung konnte nicht gespeichert werden'
          );
        });
  }

  createOrUpdateTravel(travel: Travel) {
    if (travel.id !== '' && travel.id !== undefined) {
      this.travelRef
        .update({
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
        })
        .then(() => {
          this.notification.showSuccess(
            'Reise',
            'Reise erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Reise',
            'Änderung konnte nicht gespeichert werden'
          );
        });
    } else {
      this.travelListRef
        .push({
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
        })
        .then(() => {
          this.notification.showSuccess(
            'Reise',
            'Land erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Reise',
            'Änderung konnte nicht gespeichert werden'
          );
        });
    }
  }

  createOrUpdateWorkTime(worktime: Worktime) {
    if (worktime.id !== '') {
      this.workTimeRef
        .update({
          start: worktime.start,
          end: worktime.end,
          duration: worktime.duration,
          break: worktime.break,
          comment: worktime.comment,
          userId: worktime.userId,
          date: worktime.date,
        })
        .then(() => {
          this.notification.showSuccess(
            'Arbeitszeit',
            'Arbeitszeit erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Arbeitszeit',
            'Änderung konnte nicht gespeichert werden'
          );
        });
    } else
      this.workTimeListRef
        .push({
          start: worktime.start,
          end: worktime.end,
          duration: worktime.duration,
          break: worktime.break,
          comment: worktime.comment,
          userId: worktime.userId,
          date: worktime.date,
        })
        .then(() => {
          this.notification.showSuccess(
            'Arbeitszeit',
            'Arbeitszeit erfolgreich gespeichert'
          );
        })
        .catch((err) => {
          console.log(err, 'DataService');
          this.notification.showError(
            'Arbeitszeit',
            'Änderung konnte nicht gespeichert werden'
          );
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

  getAppUserByUid(id: string) {
    this.userRef = this.db.object('/users/' + id);
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
    this.countryRef
      .remove()
      .then(() => {
        this.notification.showWarning('Land', 'Land gelöscht');
      })
      .catch((err) => {
        console.log(err, 'DataService');
        this.notification.showError(
          'Land',
          'Änderung konnte nicht gespeichert werden'
        );
      });
  }

  deleteWorktime(id: string) {
    this.workTimeRef = this.db.object('worktimes/' + id);
    this.workTimeRef
      .remove()
      .then(() => {
        this.notification.showWarning('Arbeitszeit', 'Arbeitszeit gelöscht');
      })
      .catch((err) => {
        console.log(err, 'DataService');
        this.notification.showError(
          'Arbeitszeit',
          'Änderung konnte nicht gespeichert werden'
        );
      });
  }

  deleteTravel(id: string) {
    this.travelRef = this.db.object('travels/' + id);
    this.travelRef
      .remove()
      .then(() => {
        this.notification.showWarning('Reise', 'Reise gelöscht');
      })
      .catch((err) => {
        console.log(err, 'DataService');
        this.notification.showError(
          'Land',
          'Änderung konnte nicht gespeichert werden'
        );
      });
  }

  deleteCustomer(id: string) {
    this.customerRef = this.db.object('customers/' + id);
    this.customerRef
      .remove()
      .then(() => {
        this.notification.showWarning('Kunde', 'Kunde gelöscht');
      })
      .catch((err) => {
        console.log(err, 'DataService');
        this.notification.showError(
          'Kunde',
          'Änderung konnte nicht gespeichert werden'
        );
      });
  }
}
