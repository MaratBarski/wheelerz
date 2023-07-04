import { Component, ChangeDetectionStrategy, Input, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FileImageComponent } from '../file-image/file-image.component'
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ImageComponent } from '../image/image.component'
import { DirectionDirective } from 'src/app/directives/direction.directive'

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, FileImageComponent, MatDialogModule, TranslatePipe, ImageComponent, DirectionDirective],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  providers: [MatDialogConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleryComponent {
  @Input() files: string[] = []
  @Input() name = ''
  @Input() text = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PhotoGalleryComponent>) {
    this.files = data.files.map((x: any) => x.fileName)
    this.name = data.name
    this.text = data.text
  }

  currentIndex = 0

  get currentFile(): string {
    return this.files[this.currentIndex]
  }

  setCurrent(i: number): void {
    this.currentIndex = i
  }

  close(): void {
    this.dialogRef.close()
  }
}
