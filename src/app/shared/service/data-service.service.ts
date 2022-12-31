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

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  constructor(private db: AngularFireDatabase) {}

  addCountry() {}
}
