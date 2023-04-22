import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ChairInfo } from 'src/app/models/user-accessibility'
import { FormsModule } from '@angular/forms'
import { RadioComponent } from '../radio/radio.component'
import { ImageComponent } from '../image/image.component'

@Component({
  selector: 'app-chair-info',
  standalone: true,
  imports: [CommonModule, ImageComponent, TranslatePipe, FormsModule, RadioComponent],
  templateUrl: './chair-info.component.html',
  styleUrls: ['./chair-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChairInfoComponent {
  @Input() chairInfo!: ChairInfo
  @Input() selectedKey = 'cm'

  @Output() onChangeCm = new EventEmitter<string>()

  changeCm(value: any): void {
    this.selectedKey = value.key
    this.onChangeCm.emit(value.key)
  }
}
