import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslationService } from 'src/app/services/translation.service'

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {
  translationService = inject(TranslationService)
  @Input() src = ''
  @Input() lang = false

  get path(): string {
    return this.lang ?  `./assets/img/${this.translationService.lang}/${this.src}` : `./assets/img/${this.src}`
  }
}
