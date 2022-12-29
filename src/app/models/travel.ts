import { Customer } from './customer';
import { Spend } from './spend';

export interface Travel {
  id?: number;
  start?: string;
  end?: string;
  spend?: Spend[];
  customer?: Customer;
  rate?: number;
  spendValue?: number;
  total?: number;
}
