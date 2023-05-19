import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { Attachment } from 'src/app/models/story'
import { ImageService } from 'src/app/services/image.service'
import { FileImage } from 'src/app/models/fileImage'
import { FileImageComponent } from '../file-image/file-image.component'
import { HttpClientModule } from '@angular/common/http'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-input-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslatePipe,
    FileImageComponent,
  ],
  templateUrl: './input-comment.component.html',
  styleUrls: ['./input-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCommentComponent {
  userService = inject(UserService)

  @Input() maxFileCount = 4
  @Input() form!: FormGroup
  @Input() controlName = 'comments'
  @Input() titlePlaceholder = 'title'
  @Input() commentPlaceholder = 'your_story'
  @Input() images?: Attachment[]
  @Input() files: FileImage[] = []
  @Input() isEditor = true
  @Input() isTitle = true
  @Input() isFooter = true
  @Input() areaHeight = 300
  @Input() isAddPhotoEnable = false
  @Input() isForceAddPhotoDisable = false


  @Output() onImageUpdates = new EventEmitter<FileImage[]>()

  @ViewChild('file') file!: ElementRef<HTMLInputElement>

  get isFilesOverSize(): boolean {
    return this.files.length >= this.maxFileCount
  }

  imageService = inject(ImageService)
  changeDetectorRef = inject(ChangeDetectorRef)

  openAttachment(): void {
    this.file.nativeElement.click()
  }

  deleteImage(i: any): void {
    this.files = this.files.filter(x => x !== i)
    this.onImageUpdates.emit(this.files)
  }

  async changeFile(event: any) {
    if (!event?.target?.files?.length) return

    for (let i = 0; i < event.target.files.length; i++) {
      const mimeType = event.target.files[i].type
      if (mimeType.match(/image\/*/) == null) continue

      const url = await this.imageService.getPreview(event.target.files[i])
      this.files = [...this.files, url]
    }
    if (!this.userService.isAdmin) this.files.splice(0, this.files.length - this.maxFileCount)

    this.file.nativeElement.value = ''
    this.changeDetectorRef.markForCheck()
    this.onImageUpdates.emit(this.files)
  }
}
