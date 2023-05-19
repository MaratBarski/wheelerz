import { Inject, Injectable } from '@angular/core';
import { DatePickerConfig, DateRangeSelector, FullName, IDatePickerConfig } from '../models/dates';

@Injectable()
export class DateRangeService {

  constructor(@Inject(DatePickerConfig) private config: IDatePickerConfig) { }

  get weekDays(): FullName[] { return this.config.weekDays; }
  get months(): FullName[] { return this.config.months; }
  get selectors(): DateRangeSelector[] { return this.config.dateRangeSelectors; }

  isDateEqual(d1: Date, d2: Date | undefined): boolean {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  compareMonth(d1: Date, d2: Date): -1 | 1 | 0 {
    if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) return 0;
    if (d1.getFullYear() > d2.getFullYear()) return 1;
    if (d1.getFullYear() < d2.getFullYear()) return -1;
    if (d1.getMonth() < d2.getMonth()) return -1;
    return 1;
  }

  isNextMonth(d1: Date, d2: Date): boolean {
    const date = new Date(d1);
    date.setMonth(date.getMonth() + 1);
    return this.compareMonth(date, d2) === 0;
  }

  setTime(date: Date, time: number[]): Date | undefined {
    if (!date) return undefined;
    const res = new Date(date);
    res.setSeconds(time[2]);
    res.setMinutes(time[1]);
    res.setHours(time[0]);
    return res;
  }

  isValid(date: any): boolean {
    if (!date) return false;
    return !isNaN(+date);
  }
}
