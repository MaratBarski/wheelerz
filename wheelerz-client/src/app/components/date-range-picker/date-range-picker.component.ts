import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeResponse, DateRange, DateRangeSelector } from 'src/app/models/dates';
import { DateRangeService } from 'src/app/services/date-range.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { DateRangeSelectorComponent } from '../date-range-selector/date-range-selector.component';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {

  @ViewChild('firstPicker', { static: true }) firstPicker!: DatePickerComponent;
  @ViewChild('secondPicker', { static: true }) secondPicker!: DatePickerComponent;
  @ViewChild('selector', { static: true }) selector!: DateRangeSelectorComponent;

  @Output() applyRange = new EventEmitter<DateRangeResponse>();

  @Input() set selectorId(value: number) {
    this._selectorId = value;
  }

  @Input() set dateRange(value: DateRange) {
    this._dateRange = value;
    if (this._dateRange.endDate < this._dateRange.startDate)
      this._dateRange.endDate = this._dateRange.startDate;
    this.initDate();
  }

  private _selectorId = -1;

  private _dateRange: DateRange = {
    startDate: new Date(),
    endDate: new Date()
  };

  firstSelectedDate!: Date;
  secondSelectedDate!: Date;

  get dateRange(): DateRange { return this._dateRange; }
  get selectorId(): number { return this._selectorId }
  get selectors(): DateRangeSelector[] { return this.dateRangeService.selectors; }
  get startHour(): number { return this.dateRange?.startDate?.getHours() || 0; }
  get startMinute(): number { return this.dateRange?.startDate?.getMinutes() || 0; }
  get startSecond(): number { return this.dateRange?.startDate?.getSeconds() || 0; }
  get endHour(): number { return this.dateRange?.endDate?.getHours() || 0; }
  get endMinute(): number { return this.dateRange?.endDate?.getMinutes() || 0; }
  get endSecond(): number { return this.dateRange?.endDate?.getSeconds() || 0; }

  constructor(private dateRangeService: DateRangeService) { }

  ngOnInit(): void { this.initDate(); }

  initDate(): void {
    this.firstSelectedDate = new Date(this.dateRange.endDate.getFullYear(), this.dateRange.endDate.getMonth(), 0);
    this.secondSelectedDate = new Date(this.dateRange.endDate);
  }

  timeChange(time: number[], property: 'endDate' | 'startDate'): void {
    if (!this.dateRange || !this.dateRange[property]) return;
    this.resetSelector();
    (this.dateRange[property] as any) = this.dateRangeService.setTime(this.dateRange[property], time);
  }

  setdateRange(date: Date): void {
    this.resetSelector();
    if ((this.dateRange.startDate && this.dateRange.endDate) ||
      (!this.dateRange?.startDate || this.dateRange.startDate > date)
    ) {
      this._dateRange = {
        startDate: date, endDate: undefined as any
      }
    } else {
      this._dateRange = { ...this.dateRange, endDate: date };
    }
  }

  apply(): void {
    this.applyRange.emit({
      dateRange: this._dateRange,
      selector: this.selectors.find(x => x.id === this.selectorId) as any
    });
  }

  resetSelector(): void { this.selectorId = 9; }

  firstDateSelected(date: Date): void { this.setdateRange(date); }

  secondDateSelected(date: Date): void { this.setdateRange(date); }

  firstMonthSelected(index: 1 | -1): void { this.secondPicker.setMonth(index); }

  secondMonthSelected(index: 1 | -1): void { this.firstPicker.setMonth(index); }

  secondMouseDateOver(isSet: boolean): void { this.firstPicker.setRange(isSet); }

  resetMonth(): void { this.secondPicker.resetMonth(this.dateRange); }

  mouseDateOverUpdate(date: Date): void { this.secondPicker.setDateOver(date); }

  rangeSelect(selector: DateRangeSelector): void {
    this._selectorId = selector.id;
    const range = selector.getRange();
    if (!range) return;
    this.dateRange = range;
    this.resetMonth();
  }
}
