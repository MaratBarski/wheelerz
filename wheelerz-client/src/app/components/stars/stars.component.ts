import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { ReverseDirective } from 'src/app/directives/reverse.directive'

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReverseDirective],
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarsComponent {
  value = 0
  stars: string[] = []
  
  @Input() set estimation(value: number) {
    this.stars = []
    for (let i = 0; i < Math.floor(value * 5 / 10); i++) this.stars.push('star-full')
    if (value % 2) this.stars.push('star-half')
    while (this.stars.length < 5) this.stars.push('star-empty')
    this.value = value
  }
  
  get title(): string {
    if (this.value < 2) return 'Not Accessible'
    if (this.value < 4) return 'Terrible'
    if (this.value < 5) return 'Bad'
    if (this.value < 7) return 'OK'
    if (this.value < 8) return 'Good'
    if (this.value < 9) return 'Great'

    return 'Excellent'
  }
}
