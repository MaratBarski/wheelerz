import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageService } from 'src/app/services/image.service'
import { DataService } from 'src/app/services/data.service'
import { first } from 'rxjs'
import { SERVER_URL } from 'src/app/consts'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AvatarComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>
  imageService = inject(ImageService)
  dataService = inject(DataService)
  changeDetectorRef = inject(ChangeDetectorRef)
  @Input() avatar?: string
  @Input() isEditable = false
  @Input() width = 200
  @Output() onChange = new EventEmitter<string>()
  @Input() userId = 0
  @Input()raduius = 200

  openFile(): void {
    this.fileUpload.nativeElement.click()
  }

  ngOnInit(): void {
    if (this.avatar)
      this.avatar = `${SERVER_URL}/image/p${this.avatar}`
  }

  async changeFile(event: any) {
    if (!event?.target?.files?.length) return
    const mimeType = event.target.files[0].type
    if (mimeType.match(/image\/*/) == null) return

    const url = await this.imageService.getPreview(event.target.files[0])
    this.avatar = url.small
    this.dataService.changeAvatar(url, this.userId).pipe(first()).subscribe()

    this.fileUpload.nativeElement.value = ''
    this.changeDetectorRef.markForCheck()
    this.onChange.emit(this.avatar)
  }
}
