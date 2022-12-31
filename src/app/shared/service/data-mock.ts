import { Observable } from 'rxjs';
import { Country } from 'src/app/models/country';

export interface IMockData {
  getCountry(): Observable<Country[]>;
}
