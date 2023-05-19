import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ImageComponent } from '../image/image.component'
import { ChairOptionsDictionary } from 'src/app/models/chair'

@Component({
  selector: 'app-chair-options-view',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ImageComponent],
  templateUrl: './chair-options-view.component.html',
  styleUrls: ['./chair-options-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChairOptionsViewComponent implements OnInit {
  @Input() value?: number
  options: string[] = []

  setOptions(): void {
    this.options = []
    if (!this.value) return
    const value = this.value || 0
    // this.options.push('nedd')
    Object.keys(ChairOptionsDictionary).forEach(k => {
      if ((value & +k) === +k)
        this.options.push((ChairOptionsDictionary as any)[k])
    })

  }

  ngOnInit(): void {
    this.setOptions()
  }

}
