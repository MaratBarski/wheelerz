import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ImageComponent } from '../image/image.component'


@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ImageComponent],
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataComponent {
  @Input() nodata = 'no_data'
  @Input() src = 'nofound-city.svg'
}
