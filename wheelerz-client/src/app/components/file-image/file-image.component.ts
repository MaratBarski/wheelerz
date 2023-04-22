import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core'
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
export class FileImageComponent implements AfterViewInit, OnChanges {
  cd = inject(ChangeDetectorRef)

  @Input() fileName!: string
  @Input() small?: string
  @Input() isBig = false
  @ViewChild('img') img!: ElementRef<HTMLImageElement>
  isLoading = true

  get prefix(): string {
    return this.isBig ? '' : 'p'
  }

  get src(): string {
    return this.small ? this.small : `${SERVER_URL}/image/${this.prefix}${this.fileName}`
  }

  stopLoading(): void {
    this.isLoading = false
    this.cd.markForCheck()
  }

  ngAfterViewInit(): void {
    this.img.nativeElement.onerror = () => {
      this.stopLoading()
    }
    this.img.nativeElement.onload = () => {
      this.stopLoading()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileName']) this.isLoading = true
    if (changes['small']) this.isLoading = true

    this.cd.markForCheck()
  }
}
