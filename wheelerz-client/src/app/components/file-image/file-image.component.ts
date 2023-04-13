import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SERVER_URL } from 'src/app/consts'

@Component({
  selector: 'app-file-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-image.component.html',
  styleUrls: ['./file-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileImageComponent {
  @Input() fileName!: string
  @Input() small?: string

  get src(): string {
    return this.small ? this.small : `${SERVER_URL}/image/p${this.fileName}`
  }
}
