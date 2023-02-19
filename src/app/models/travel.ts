import { Catering } from './catering';
import { Customer } from './customer';
import { Spend } from './spend';

export interface Travel {
  id?: string;
  start?: string;
  end?: string;
  spend?: Spend[];
  customer?: Customer;
  rate?: number;
  spendValue?: number;
  total?: number;
  userId?: string;
  catering?: Catering;
  breakfast?: boolean;
  launch?: boolean;
  dinner?: boolean;
  reason?: string;
  isSubmitted?: boolean;
  isPaid?: boolean;
}
