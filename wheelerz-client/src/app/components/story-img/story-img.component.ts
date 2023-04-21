import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FileImageComponent } from '../file-image/file-image.component'
import { StoryPhoto } from 'src/app/models/fileImage'
import { StoryImageListPipe } from 'src/app/pipes/story-image-list.pipe'

@Component({
  selector: 'app-story-img',
  standalone: true,
  imports: [CommonModule, FileImageComponent, StoryImageListPipe],
  templateUrl: './story-img.component.html',
  styleUrls: ['./story-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryImgComponent {
  @Input() photos: StoryPhoto[] = []
  currentIndex = 0

  get currentPhoto(): StoryPhoto {
    return this.photos[this.currentIndex]
  }

  setImg(index: number, add: number): void {
    this.currentIndex = index + add
  }
}
