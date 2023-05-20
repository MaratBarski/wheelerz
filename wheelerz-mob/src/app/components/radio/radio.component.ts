import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule, KeyValue } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, TranslatePipe, IonicModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent {
  @Input() selectedValue?: any
  @Input() selectedKey?: any
  @Input() values: KeyValue<any, string>[] = []
  @Output() change = new EventEmitter<any>()

  select(value: any): void {
    this.selectedValue = value
    this.change.emit(value)
  }
}
