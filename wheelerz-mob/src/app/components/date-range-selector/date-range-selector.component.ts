import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateRangeSelector } from 'src/app/models/dates';

@Component({
  selector: 'app-date-range-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeSelectorComponent implements OnInit {

  @Output() rangeSelect = new EventEmitter<DateRangeSelector>();

  @Input() set selectors(value: DateRangeSelector[]) {
    this._selectors = value;
    this.initSelector();
  }

  @Input() set selector(id: number) {
    this._selectorId = id;
    this.initSelector();
  }

  get selectors(): DateRangeSelector[] {
    return this._selectors;
  }

  get selectorId(): number { return this._selectorId; }
  private _selector!: DateRangeSelector;
  private _selectorId = -1;
  private _selectors!: DateRangeSelector[]

  ngOnInit(): void {
    if (!this._selector && this.selectors?.length)
      this._selector = this.selectors[this.selectors.length - 1];
  }

  selectRange(selector: DateRangeSelector): void {
    //if (this._selector === selector) return;
    this._selector = selector;
    this._selectorId = selector.id;
    this.rangeSelect.emit(selector);
  }

  isCurrent(selector: DateRangeSelector): boolean {
    return this._selector === selector;
  }

  private initSelector(): void {
    if (!this.selectors) return;
    const s = this.selectors.find(x => x.id === this._selectorId);
    if (!s) return;
    this._selector = s;
    setTimeout(() => { this.rangeSelect.emit(this._selector); });
  }
}
