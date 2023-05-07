import * as moment from 'moment';

import { Catering } from '../../models/catering';
import { Customer } from '../../models/customer';

export class Helpers {
  static splitTime(time: string): string[] {
    return time.split(':');
  }

  static calcRate(
    duration: number,
    customer: Customer,
    catering: Catering
  ): number {
    let value;
    let durDays = Math.floor(duration / 1440);
    let durHours = Math.floor((duration % 1440) / 60);
    let deduction = 0;

    console.log(duration + ' ' + durHours + ' ' + durDays);

    //Frühstück abziehen
    if (catering.breakfast) {
      deduction = 0.2;
    }

    //Mittag abziehen
    if (catering.launch) {
      deduction += 0.4;
    }

    //Abendessen abziehen
    if (catering.dinner) {
      deduction += 0.4;
    }

    console.log(deduction);

    if (duration > 0 && customer !== undefined && catering !== undefined) {
      console.log(deduction);
      //Anzahl Tage 0 und > 8h
      if (durDays == 0 && durHours > 8) {
        return customer.country?.halfRate as number;
      }

      //Anzahl Tage
      if (durDays == 1) {
        return (
          (customer.country?.rate as number) -
          (customer.country?.rate as number) * deduction
        );
      }

      if (durDays > 1) {
        return (
          (customer.country?.rate as number) * durDays -
          (customer.country?.rate as number) * deduction * durDays
        );
      }
    }

    return 0;
  }

  static dateTime(date: Date, time: string): Date {
    if (date && time) {
      let t = time.split(':');
      date.setHours(Number(t[0]));
      date.setMinutes(Number(t[1]));
      return date;
    }
    return new Date();
  }

  static calcDiffinMinutes(start: Date, end: Date): number {
    let mStart = moment(start, 'DD-MM-YYYY hh:mm');
    let mEnd = moment(end, 'DD-MM-YYYY hh:mm');
    return mEnd.diff(mStart, 'minutes');
  }

  static convertMsToHM(milliseconds) {
    let d = moment.duration(milliseconds, 'milliseconds');
    let h = Math.floor(d.asHours());
    let m = Math.floor(d.asMinutes()) - h * 60;

    return h + ':' + m;
  }

  static datesAreEqual(date1: Date, date2: Date) {
    console.log(date1 + ' ' + date2);
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true;
    }
    return false;
  }

  static monthList(): string[] {
    return [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
  }
}
