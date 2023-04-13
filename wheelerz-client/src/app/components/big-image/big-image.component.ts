import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SERVER_URL } from 'src/app/consts'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-big-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './big-image.component.html',
  styleUrls: ['./big-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigImageComponent {
  loader = inject(LoaderService)
  @Input() files: { fileName: string }[] = []
  @Input() file!: { fileName: string }
  top = 10
  isShowBig = false

  get src(): string {
    return `${SERVER_URL}/image/${this.file.fileName}`
  }

  openBig(event: MouseEvent): void {
    event.stopPropagation()
    //this.top = document.documentElement.scrollTop + 10
    this.isShowBig = true
    this.loader.load(true)
  }

  closeBig(): void {
    this.isShowBig = false
    this.loader.load(false)
  }
}
