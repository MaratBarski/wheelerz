import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ChairOption } from 'src/app/models/user-accessibility'
import { RadioComponent } from '../radio/radio.component'

@Component({
  selector: 'app-chair-options',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RadioComponent],
  templateUrl: './chair-options.component.html',
  styleUrls: ['./chair-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChairOptionsComponent {
  @Input() chairOptions!: ChairOption[]
  @Input() currentIndex = 0
  get currentOption(): ChairOption {
    return this.chairOptions[this.currentIndex]
  }
  change(event: any): void {
    this.currentOption.selectedKey = event.key
  }
}
