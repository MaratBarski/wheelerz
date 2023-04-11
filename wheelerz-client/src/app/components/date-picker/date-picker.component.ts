import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRange, FullName, WeekDay } from 'src/app/models/dates';
import { DateRangeService } from 'src/app/services/date-range.service';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DateRangeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {

  @Input() firstDay: WeekDay = 1;
  @Input() dayFormat = 'd';
  @Input() range: -1 | 0 | 1 = -1;
  @Input() dateRange?: DateRange;

  @Input() set chosenDate(value: Date) {
    this._isInit = false;
    this.selectedDate = value;
  }

  @Input() set selectedDate(value: Date) {
    this._selectedDate = value;
    this.firstDate = undefined;
    this._isInit = false;
    this.initView();
  }
  get selectedDate(): Date { return this._selectedDate; }

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthSelected = new EventEmitter<number>();
  @Output() mouseDateOver = new EventEmitter<boolean>();
  @Output() mouseDateOverUpdate = new EventEmitter<Date>();

  currentMonth!: number;
  currentYear!: number;
  firstDate!: Date | undefined;
  weekdays!: FullName[];
  dates!: Date[][];

  private _selectedDate: Date = new Date();
  private _dateOver?: Date;
  private _isfirstRange = false;
  private _isInit = false;

  get months(): FullName[] { return this.dateRangeService.months; }
  get isNoRange(): boolean { return this.range === -1; }
  get isFirstRange(): boolean { return this.range == 0; }
  get isSecondRange(): boolean { return this.range == 1; }
  get isInitialDateRange(): boolean {
    return !!((this.dateRange?.startDate && this.dateRange?.endDate) || (!this.dateRange?.startDate && !this.dateRange?.endDate));
  }

  constructor(
    private dateRangeService: DateRangeService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initView();
  }

  initView(): void {
    if (this._isInit) return;
    this._isInit = true;
    this.initWeekDays();
    this.initFirstDate();
    this.initMonth();
    this.changeDetectorRef.markForCheck();
  }

  private initWeekDays(): void {
    this.weekdays = [];
    let d = this.firstDay;
    for (let i = 0; i < 7; i++) {
      this.weekdays.push(this.dateRangeService.weekDays[d++]);
      if (d > 6) d = 0;
    }
  }

  private initMonth(): void {
    const start = new Date(this.firstDate || 0);
    this.dates = [];
    let d: Date[] = [];
    for (let i = 0; i < 42; i++) {
      d.push(new Date(start));
      start.setDate(start.getDate() + 1);
      if (d.length === 7) {
        this.dates.push(d);
        d = [];
      }
    }
  }

  private initFirstDate(): void {
    if (!this.firstDate) {
      this.firstDate = new Date(this.selectedDate);
      this.currentMonth = this.firstDate.getMonth();
      this.currentYear = this.firstDate.getFullYear();
    }
    this.firstDate.setDate(1);
    this.firstDate.setHours(0);
    this.firstDate.setMinutes(0);
    this.firstDate.setSeconds(0);
    this.firstDate.setMilliseconds(0);
    while (this.firstDate.getDay() !== this.firstDay)
      this.firstDate.setDate(this.firstDate.getDate() - 1);
  }

  nextMonth(i: 1 | -1): void {
    this.setMonth(i);
    this.monthSelected.emit(i);
  }

  setMonth(i: 1 | -1): void {
    this.currentMonth += i;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.firstDate = new Date(this.currentYear, this.currentMonth, 1);
    this.initFirstDate();
    this.initMonth();
    this.changeDetectorRef.markForCheck();
  }

  selectDate(date: Date, row: number): void {
    this._selectedDate = date;
    this.dateMouseLeave();
    this.dateSelected.emit(date);
    this.correctMonth(date, row);
    this.changeDetectorRef.detectChanges();
  }

  private correctMonth(date: Date, row: number): void {
    if (date.getMonth() === this.currentMonth) return;
    if (this.isNoRange) {
      if (row === 0) this.nextMonth(-1);
      else this.nextMonth(1);
    }
    else if (this.range === 0) {
      if (this.isInitialDateRange) {
        if (row === 0) this.nextMonth(-1);
        else this.nextMonth(1);
      } else if (row === 0) {
        this.nextMonth(-1);
      }
    } else if (this.range === 1) {
      if (this.dateRange?.startDate && !this.dateRange?.endDate) {
        if (row !== 0) this.nextMonth(1);
      } else if (this.isInitialDateRange) {
        if (row !== 0) this.nextMonth(1);
      }
    }
  }

  isSelected(d: Date): boolean {
    if (d.getMonth() !== this.currentMonth) return false;
    if (this.dateRange) {
      return this.dateRangeService.isDateEqual(d, this.dateRange.startDate) ||
        this.dateRangeService.isDateEqual(d, this.dateRange.endDate)
    }
    return this.dateRangeService.isDateEqual(d, this.selectedDate);
  }

  isInRangeOver(date: Date): boolean {
    if (!this.dateRange) return false;
    if (date.getMonth() !== this.currentMonth) return false;
    if (this.dateRange.startDate && this.dateRange.endDate) return false;
    if (this._isfirstRange)
      return date >= this.dateRange.startDate;
    if (!this._dateOver) return false;
    return date >= this.dateRange.startDate && date <= this._dateOver;
  }

  isInRange(date: Date): boolean {
    if (!this.dateRange) return false;
    if (date.getMonth() !== this.currentMonth) return false;
    if (this.dateRange.startDate && this.dateRange.endDate) {
      return date >= this.dateRange.startDate &&
        date <= this.dateRange.endDate;
    }
    return false;
  }

  setRange(isSet: boolean): void {
    this._isfirstRange = isSet;
    this.changeDetectorRef.markForCheck();
  }

  dateMouseEnter(date: Date): void {
    if (!this.dateRange) return;
    this.setDateOver(date);
    this.mouseDateOver.emit(true);
    this.mouseDateOverUpdate.emit(date);
  }

  setDateOver(date: Date): void {
    this._dateOver = date;
    this.changeDetectorRef.markForCheck();
  }

  isCurrentMonth(date: Date): boolean {
    return this.currentMonth === date.getMonth();
  }

  dateMouseLeave(): void {
    this._dateOver = undefined;
    this.mouseDateOverUpdate.emit(undefined);
    this.mouseDateOver.emit(false);
  }

  isNextMonth(date: Date): boolean {
    return this.currentMonth !== date.getMonth();
  }

  isStart(date: Date): boolean {
    if (!this.isCurrentMonth(date)) return false;
    return this.dateRangeService.isDateEqual(date, this.dateRange?.startDate);
  }

  isEnd(date: Date): boolean {
    if (!this.isCurrentMonth(date)) return false;
    return this.dateRangeService.isDateEqual(date, this.dateRange?.endDate);
  }

  isStartAndEnd(date: Date): boolean {
    if (!this.isCurrentMonth(date)) return false;
    return this.isStart(date) && this.isEnd(date);
  }

  resetMonth(dateRange: DateRange): void {
    this.dateRange = { ...dateRange };
    const date = new Date(this.currentYear, this.currentMonth, 1);
    const startDate = new Date(this.dateRange.startDate.getFullYear(), this.dateRange.startDate.getMonth(), 1);
    if (!this.dateRangeService.isValid(date)) return;
    if (!this.dateRangeService.isValid(startDate)) return;
    const setep = date > startDate ? -1 : 1;
    while (this.dateRangeService.compareMonth(date, startDate) !== 0) {
      this.nextMonth(setep);
      date.setMonth(date.getMonth() + setep);
    }
    this.nextMonth(1);
  }
}
