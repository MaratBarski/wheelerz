import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageComponent } from '../image/image.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ImageComponent, TranslatePipe],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent {
  @Input() name?: string
  @Input() phone?: string
  @Input() mail?: string
  @Input() link?: string

  order(): void {
    window.open(this.link)
  }
}
