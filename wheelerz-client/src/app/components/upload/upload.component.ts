import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FileImage } from 'src/app/models/fileImage'
import { ImageService } from 'src/app/services/image.service'
import { FileImageComponent } from '../file-image/file-image.component'

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule,FileImageComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  changeDetectorRef = inject(ChangeDetectorRef)
  imageService = inject(ImageService)

  @ViewChild('file') file!: ElementRef<HTMLInputElement>
  @Input() files: FileImage[] = []
  @Input() multiple = true
  @Output() onChange = new EventEmitter<FileImage[]>()

  openAttachment(): void {
    this.file.nativeElement.click()
  }

  deleteImage(i: FileImage): void {
    this.files = this.files.filter(x => x !== i)
    this.onChange.emit(this.files)
  }

  async changeFile(event: any) {
    if (!event?.target?.files?.length) return

    for (let i = 0; i < event.target.files.length; i++) {
      const mimeType = event.target.files[i].type
      if (mimeType.match(/image\/*/) == null) continue

      const url = await this.imageService.getPreview(event.target.files[i])
      this.files = [...this.files, url]
    }
    if (!this.multiple) this.files = this.files.filter((x, i) => i === this.files.length - 1)
    this.file.nativeElement.value = ''
    this.changeDetectorRef.markForCheck()
    this.onChange.emit(this.files)
  }
}
