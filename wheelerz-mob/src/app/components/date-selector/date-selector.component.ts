import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DatePickerComponent } from '../date-picker/date-picker.component'
import { DateTimeService } from 'src/app/services/date-time.service'

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule, DatePickerComponent],
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateSelectorComponent {
  @Input() selectedDate: Date | undefined = new Date()
  @Output() dateSelected = new EventEmitter<Date>()

  dateService = inject(DateTimeService)

  isShow = false

  selectDate(date: Date): void {
    this.selectedDate = date
    this.isShow = false
    this.dateSelected.emit(date)
  }

  openPopup(event: any): void {
    this.isShow = !this.isShow
  }
}
