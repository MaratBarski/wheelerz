import { Component, ChangeDetectionStrategy, Input, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FileImageComponent } from '../file-image/file-image.component'

import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ImageComponent } from '../image/image.component'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, FileImageComponent, TranslatePipe, IonicModule, ImageComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleryComponent {
  @Input() files: string[] = []
  @Input() name = ''
  @Input() text = ''

  constructor() {
  }

  currentIndex = 0

  get currentFile(): string {
    return this.files[this.currentIndex]
  }

  setCurrent(i: number): void {
    this.currentIndex = i
  }

  close(): void {

  }
}
