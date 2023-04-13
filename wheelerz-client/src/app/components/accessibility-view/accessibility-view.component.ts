import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WizardItem } from 'src/app/models/accesability'
import { FileImageComponent } from '../file-image/file-image.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { BigImageComponent } from '../big-image/big-image.component'

@Component({
  selector: 'app-accessibility-view',
  standalone: true,
  imports: [CommonModule, FileImageComponent, TranslatePipe, BigImageComponent],
  templateUrl: './accessibility-view.component.html',
  styleUrls: ['./accessibility-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityViewComponent {
  @Input() accessibility!: WizardItem
}
