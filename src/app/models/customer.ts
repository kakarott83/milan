import { Country } from './country';

export interface Customer {
  id?: string;
  city?: string;
  name?: string;
  country?: Country;
}
